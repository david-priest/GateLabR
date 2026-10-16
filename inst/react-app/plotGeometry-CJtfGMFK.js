function h(t, n, i) {
  if (!n || !i) return null;
  const o = t.querySelector(".cytof-overlay");
  if (!o) return null;
  const l = t.getBoundingClientRect(), u = o.getBoundingClientRect();
  return !(u.width > 0) || !(u.height > 0) || !(n[1] - n[0] > 0) || !(i[1] - i[0] > 0) ? null : { left: u.left - l.left, top: u.top - l.top, width: u.width, height: u.height, xr: n, yr: i };
}
function c(t, n, i) {
  const o = (n - t.left) / t.width, l = (i - t.top) / t.height;
  return [t.xr[0] + o * (t.xr[1] - t.xr[0]), t.yr[1] - l * (t.yr[1] - t.yr[0])];
}
function s(t, n, i) {
  const o = (n - t.xr[0]) / (t.xr[1] - t.xr[0]), l = (t.yr[1] - i) / (t.yr[1] - t.yr[0]);
  return [t.left + o * t.width, t.top + l * t.height];
}
function e(t, n) {
  return [n / t.width * (t.xr[1] - t.xr[0]), n / t.height * (t.yr[1] - t.yr[0])];
}
function d(t, n, i) {
  return n >= t.left && n <= t.left + t.width && i >= t.top && i <= t.top + t.height;
}
export {
  c as a,
  e as b,
  s as d,
  d as i,
  h as p
};
