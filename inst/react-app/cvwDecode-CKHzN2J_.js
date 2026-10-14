const a = 64;
const n = new Uint16Array(256);
for (let t = 0; t < 256; t++) {
  let e = 0;
  for (let o = 0; o < 8; o++) e |= (t >> o & 1) << 7 - o;
  n[t] = e;
}
const s = new Float32Array(256 / 2), N = new Float32Array(256 / 2);
for (let t = 0; t < 256 / 2; t++)
  s[t] = Math.cos(-2 * Math.PI * t / 256), N[t] = Math.sin(-2 * Math.PI * t / 256);
export {
  a as N
};
