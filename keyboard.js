/**
 * reference
 * https://github.com/aidantwoods/RPi0w-keyboard/blob/master/src/home/pi/hid-gadget-test.c
 */
const modifier = {
  "left-ctrl": 0x01,
  "right-ctrl": 0x10,
  "left-shift": 0x02,
  "right-shift": 0x20,
  "left-alt": 0x04,
  "right-alt": 0x40,
  "left-meta": 0x08,
  "right-meta": 0x80,
};

const keys = {
  a: 0x04,
  b: 0x05,
  c: 0x06,
  d: 0x07,
  e: 0x08,
  f: 0x09,
  g: 0x0a,
  h: 0x0b,
  i: 0x0c,
  j: 0x0d,
  k: 0x0e,
  l: 0x0f,
  m: 0x10,
  n: 0x11,
  o: 0x12,
  p: 0x13,
  q: 0x14,
  r: 0x15,
  s: 0x16,
  t: 0x17,
  u: 0x18,
  v: 0x19,
  w: 0x1a,
  x: 0x1b,
  y: 0x1c,
  z: 0x1d,
  1: 0x1e,
  2: 0x1f,
  3: 0x20,
  4: 0x21,
  5: 0x22,
  6: 0x23,
  7: 0x24,
  8: 0x25,
  9: 0x26,
  0: 0x27,
  return: 0x28,
  enter: 0x28,
  esc: 0x29,
  escape: 0x29,
  bckspc: 0x2a,
  backspace: 0x2a,
  tab: 0x2b,
  space: 0x2c,
  minus: 0x2d,
  dash: 0x2d,
  equals: 0x2e,
  equal: 0x2e,
  lbracket: 0x2f,
  rbracket: 0x30,
  backslash: 0x31,
  hash: 0x32,
  number: 0x32,
  semicolon: 0x33,
  quote: 0x34,
  backquote: 0x35,
  tilde: 0x35,
  comma: 0x36,
  period: 0x37,
  stop: 0x37,
  slash: 0x38,
  "caps-lock": 0x39,
  capslock: 0x39,
  f1: 0x3a,
  f2: 0x3b,
  f3: 0x3c,
  f4: 0x3d,
  f5: 0x3e,
  f6: 0x3f,
  f7: 0x40,
  f8: 0x41,
  f9: 0x42,
  f10: 0x43,
  f11: 0x44,
  f12: 0x45,
  print: 0x46,
  "scroll-lock": 0x47,
  scrolllock: 0x47,
  pause: 0x48,
  insert: 0x49,
  home: 0x4a,
  pageup: 0x4b,
  pgup: 0x4b,
  del: 0x4c,
  delete: 0x4c,
  end: 0x4d,
  pagedown: 0x4e,
  pgdown: 0x4e,
  right: 0x4f,
  left: 0x50,
  down: 0x51,
  up: 0x52,
  "num-lock": 0x53,
  numlock: 0x53,
  "kp-divide": 0x54,
  "kp-multiply": 0x55,
  "kp-minus": 0x56,
  "kp-plus": 0x57,
  "kp-enter": 0x58,
  "kp-return": 0x58,
  "kp-1": 0x59,
  "kp-2": 0x5a,
  "kp-3": 0x5b,
  "kp-4": 0x5c,
  "kp-5": 0x5d,
  "kp-6": 0x5e,
  "kp-7": 0x5f,
  "kp-8": 0x60,
  "kp-9": 0x61,
  "kp-0": 0x62,
  "kp-period": 0x63,
  "kp-stop": 0x63,
  application: 0x65,
  power: 0x66,
  "kp-equals": 0x67,
  "kp-equal": 0x67,
  f13: 0x68,
  f14: 0x69,
  f15: 0x6a,
  f16: 0x6b,
  f17: 0x6c,
  f18: 0x6d,
  f19: 0x6e,
  f20: 0x6f,
  f21: 0x70,
  f22: 0x71,
  f23: 0x72,
  f24: 0x73,
  execute: 0x74,
  help: 0x75,
  menu: 0x76,
  select: 0x77,
  cancel: 0x78,
  redo: 0x79,
  undo: 0x7a,
  cut: 0x7b,
  copy: 0x7c,
  paste: 0x7d,
  find: 0x7e,
  mute: 0x7f,
  "volume-up": 0x80,
  "volume-down": 0x81,
};

module.exports = (strokes) => {
  const binds = strokes.split(" ");
  const buffArray = [];
  let withModifier = false;
  for (let i = 0; i < 8; i++) {
    if (i === 0 && modifier[binds[0]]) {
      buffArray.push(modifier[binds[0]]);
      withModifier = true;
    } else {
      if (i === 0 || i === 1) {
        buffArray.push(0x0);
      } else {
        let bind;
        try {
          bind = binds[i - (withModifier ? 1 : 2)];
          bind = keys[bind];
        } catch (e) {}
        if (bind) {
          buffArray.push(bind);
        } else {
          buffArray.push(0x0);
        }
      }
    }
  }

  console.log("buff", buffArray);

  return buffArray;
};
