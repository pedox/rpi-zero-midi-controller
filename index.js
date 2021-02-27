const { buttons, leds, ledConfig } = require("./config");

const { modes } = require("./presets.json");
const convertStrokes = require("./keyboard");

const pigpio = require("pigpio");
const Gpio = pigpio.Gpio;
const HID = require("node-hid");

pigpio.initialize();

const i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
const Oled = require("oled-i2c-bus");
const FontPack = require("oled-font-pack");
const easymidi = require("easymidi");

const oled = new Oled(i2cBus, ledConfig);
let isReady = false;

const device = new HID.HID("/dev/hidg0");

let midiOut = [];
let currentModes = 0;
let currentSubModes = 0;
let currentActiveModes = 0;

const outName = [/f_midi/, /RP-Midi/];

for (const port of easymidi.getOutputs()) {
  if (outName.find((e) => e.test(port))) {
    midiOut.push(new easymidi.Output(port));
    console.log("Connect to: ", port);
  }
}

if (midiOut.length === 0) {
  console.log("MIDI NOT ASSIGNED");
  process.exit(0);
}

console.log("Service Started...");

const updateModeDisplay = () => {
  let label;
  try {
    label = modes[currentModes][currentSubModes].labels[currentActiveModes];
  } catch (e) {}

  const currentLabel = label ? `: ${label}` : `P: ${currentActiveModes + 1}`;

  oled.clearDisplay();
  oled.setCursor(1, 1);
  oled.writeString(
    FontPack.oled_5x7,
    2,
    `${modes[currentModes][currentSubModes].name}\n${currentLabel}`,
    1,
    false
  );
  oled.update();
};

updateModeDisplay();

buttons.forEach((pin, index) => {
  const button = new Gpio(pin, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    alert: true,
  });

  let previous = 0;

  button.glitchFilter(10000);

  button.on("alert", (level, tick) => {
    if (!isReady) {
      return;
    }

    if (level === 0) {
      previous = tick;
    }
    if (level === 1) {
      const elapsed = Math.floor((tick - previous) / 1000);
      if (elapsed > 500) {
        currentSubModes += 1;
        currentActiveModes = 0;
        if (currentSubModes >= modes[currentModes].length) {
          currentSubModes = 0;
        }
        if (currentModes !== index) {
          currentSubModes = 0;
        }
        currentModes = index;
        updateModeDisplay();
      } else {
        const actions = modes[currentModes][currentSubModes].modes[index];

        for (const action of actions) {
          if (action.kind === "midi") {
            if (midiOut.length > 0) {
              console.log(action);
              midiOut.forEach((out) => {
                out.send(action.type, action.data);
              });
            }
          }
          if (action.kind === "keyboard") {
            if (device !== null) {
              setTimeout(async () => {
                for (const stroke of action.strokes) {
                  console.log(stroke);
                  const result = convertStrokes(stroke);
                  const emptyStrokes = convertStrokes("");
                  device.write(result);
                  await new Promise((r) => setTimeout(() => r(), 100));
                  device.write(emptyStrokes);
                  await new Promise((r) => setTimeout(() => r(), 100));
                }
              }, 1);
            }
          }
        }
        currentActiveModes = index;
        updateModeDisplay();
      }
      console.log(level, pin, index, elapsed);
      previous = tick;
    }
  });
});

setTimeout(() => {
  isReady = true;
  console.log("READY!");
}, 2000);

process.on("SIGINT", () => {
  oled.clearDisplay();
  pigpio.terminate();
  i2cBus.closeSync();
  console.log("Terminating...");
  setTimeout(() => {
    process.exit(2);
  }, 1000);
});
