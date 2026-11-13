var q = Object.defineProperty;
var E = (a, t, e) => t in a ? q(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var f = (a, t, e) => E(a, typeof t != "symbol" ? t + "" : t, e);
const p = "gatelab.cvw-worker.v1";
function L(a, t) {
  const e = a.display.map((r) => `${r.slot}:${r.enabled ? 1 : 0}:${r.colour}:${r.threshold}:${r.saturation}:${r.gamma}:${r.smoothing}:${a.scale[r.slot] ?? 1}`).join("|");
  return `h${t}|e${a.exposure}|${e}`;
}
class w extends Error {
  constructor() {
    super("render cancelled"), this.name = "RenderCancelled";
  }
}
function O() {
  const a = typeof navigator < "u" && typeof navigator.hardwareConcurrency == "number" ? navigator.hardwareConcurrency : 2;
  return Math.max(1, Math.min(6, a - 2));
}
const P = 128 * 1024 * 1024, x = 1e4;
function S(a) {
  return new Worker(new URL(
    /* @vite-ignore */
    "" + new URL("assets/cvw.worker-fE_N8xBf.js", import.meta.url).href,
    import.meta.url
  ), { type: "module", name: `gatelab-images-${a}` });
}
function B(a) {
  return a.cols * a.rows * 4 * ((a.composite ? 1 : 0) + Object.keys(a.channels).length);
}
function C(a) {
  var t, e, r, s, n;
  if (a.kind === "image") {
    (r = (e = (t = a.image.composite) == null ? void 0 : t.bitmap) == null ? void 0 : e.close) == null || r.call(e);
    for (const i of Object.values(a.image.channels)) (n = (s = i.bitmap) == null ? void 0 : s.close) == null || n.call(s);
  }
}
function A(a) {
  return {
    eventCount: a.eventCount,
    imageCount: a.imageCount,
    hasImage: a.hasImage,
    scale: a.scale,
    channelNames: a.channelNames,
    pixelAspectRatio: a.pixelAspectRatio,
    recordingId: a.recordingId
  };
}
class W {
  constructor(t = {}) {
    f(this, "factory");
    f(this, "bitmapBudget");
    f(this, "timeoutMs");
    f(this, "lanes", {
      interactive: { worker: null, opened: /* @__PURE__ */ new Map(), suspended: !1, held: [] },
      batch: { worker: null, opened: /* @__PURE__ */ new Map(), suspended: !1, held: [] }
    });
    f(this, "sources", /* @__PURE__ */ new Map());
    f(this, "sourceInfo", /* @__PURE__ */ new Map());
    f(this, "sourceListeners", /* @__PURE__ */ new Set());
    f(this, "pending", /* @__PURE__ */ new Map());
    f(this, "inflight", /* @__PURE__ */ new Map());
    f(this, "classifications", /* @__PURE__ */ new Map());
    f(this, "classifying", /* @__PURE__ */ new Map());
    f(this, "countWorkerCount");
    f(this, "countLanes", []);
    f(this, "cache", /* @__PURE__ */ new Map());
    f(this, "cacheHeld", 0);
    f(this, "hoverSeq", 0);
    f(this, "nextId", 0);
    f(this, "disposed", !1);
    this.factory = t.workerFactory ?? S, this.bitmapBudget = t.bitmapBudgetBytes ?? P, this.timeoutMs = t.timeoutMs ?? x, this.countWorkerCount = Math.max(1, Math.floor(t.countWorkers ?? O()));
  }
  /** Register a sample's source; the workers open it when a lane first needs it. */
  attach(t, e) {
    this.sources.get(t) !== e && (this.detach(t), this.sources.set(t, e));
  }
  detach(t) {
    var r;
    if (!this.sources.has(t)) return;
    this.sources.delete(t), this.sourceInfo.delete(t), this.classifications.delete(t);
    const e = this.classifying.get(t);
    e && (this.classifying.delete(t), e.reject(new w()));
    for (const s of Object.values(this.lanes))
      s.opened.delete(t), (r = s.worker) == null || r.postMessage({ protocol: p, type: "drop-source", fileKey: t });
    for (const s of this.countLanes)
      s.opened.delete(t) && s.worker.postMessage({ protocol: p, type: "drop-source", fileKey: t });
    for (const s of [...this.cache.keys()])
      s.startsWith(`${t}:`) && this.evict(s);
  }
  hasSource(t) {
    return this.sources.has(t);
  }
  /** What the worker found in the file; opens it on the interactive lane if nothing has. */
  info(t) {
    const e = this.sourceInfo.get(t);
    return e ? Promise.resolve(e) : this.ensureOpen("interactive", t);
  }
  /** What is already known about a file, without waiting. */
  knownInfo(t) {
    return this.sourceInfo.get(t) ?? null;
  }
  /** The objects counted for a file, when that has been done. */
  classification(t) {
    return this.classifications.get(t) ?? null;
  }
  /**
   * Count the objects in every imaged event of a file, on the batch lane. One run per file is
   * shared by every caller; `onProgress` is called per slice. Cancelling with no caller left
   * stops the worker.
   */
  classify(t, e) {
    const r = this.classifications.get(t);
    if (r) return { promise: Promise.resolve(r), cancel: () => {
    } };
    let s = this.classifying.get(t);
    if (!s) {
      const o = `cls-${++this.nextId}`;
      let c, u;
      const h = new Promise((d, g) => {
        c = d, u = g;
      });
      h.catch(() => {
      }), s = { requestId: o, promise: h, resolve: c, reject: u, listeners: /* @__PURE__ */ new Set() }, this.classifying.set(t, s);
      const l = s;
      this.ensureOpen("batch", t).then(async (d) => {
        var M, $;
        if (this.classifying.get(t) !== l) return;
        const g = ((M = this.sources.get(t)) == null ? void 0 : M.mask) ?? null, b = ($ = this.sourceInfo.get(t)) == null ? void 0 : $.scale, k = { ...g ? { slot: g.slot, fraction: g.fraction } : {}, ...b ? { scale: b } : {} }, v = Math.min(this.countWorkerCount, Math.max(1, Math.ceil(d.eventCount / 256)));
        if (v <= 1) {
          this.lane("batch").worker.postMessage({
            protocol: p,
            type: "classify",
            requestId: o,
            fileKey: t,
            ...Object.keys(k).length ? { options: k } : {}
          });
          return;
        }
        const y = this.countPool(v);
        if (await Promise.all(y.map((m) => this.openOnCountLane(m, t))), this.classifying.get(t) !== l) return;
        const I = d.eventCount;
        l.parts = y.map((m, j) => ({
          requestId: `${o}#${j}`,
          lane: m,
          start: Math.floor(j * I / y.length),
          end: Math.floor((j + 1) * I / y.length),
          done: 0,
          result: null
        }));
        for (const m of l.parts)
          m.lane.worker.postMessage({
            protocol: p,
            type: "classify",
            requestId: m.requestId,
            fileKey: t,
            options: { ...k, range: { start: m.start, end: m.end } }
          });
      }).catch((d) => {
        this.classifying.get(t) === l && (this.classifying.delete(t), l.reject(d instanceof Error ? d : new Error(String(d))));
      });
    }
    const n = s;
    e && n.listeners.add(e);
    let i = !1;
    return {
      promise: n.promise,
      cancel: () => {
        i || (i = !0, e && n.listeners.delete(e), !(n.listeners.size > 0 || this.classifying.get(t) !== n) && (this.classifying.delete(t), this.cancelCount(n), n.reject(new w())));
      }
    };
  }
  /** The cached result for an event, when there is one, so a hover paints without a round trip. */
  cached(t, e, r) {
    const s = this.cacheKey(t, e, r), n = this.cache.get(s);
    return n ? (this.cache.delete(s), this.cache.set(s, n), n.result) : null;
  }
  /** Render one event. The same event under the same settings already in flight is shared. */
  render(t, e, r, s) {
    const n = this.cacheKey(t, e, r), i = this.cached(t, e, r);
    if (i) return { promise: Promise.resolve(i), cancel: () => {
    } };
    const o = this.inflight.get(n);
    if (o && o.lane === s) return this.join(o);
    const c = `img-${++this.nextId}`, u = s === "interactive" ? ++this.hoverSeq : void 0, h = { requestId: c, lane: s, cacheKey: n, waiters: [], timer: null, sent: !1 };
    this.pending.set(c, h), this.inflight.set(n, h);
    const l = () => {
      this.pending.has(c) && this.ensureOpen(s, t).then(() => {
        this.pending.has(c) && (h.sent = !0, this.timeoutMs > 0 && (h.timer = setTimeout(
          () => this.fail(c, new Error("the image worker did not answer; reload the page if this persists")),
          this.timeoutMs
        )), this.lane(s).worker.postMessage({
          protocol: p,
          type: "render",
          requestId: c,
          fileKey: t,
          eventIndex: e,
          lane: s,
          ...u !== void 0 ? { hoverSeq: u } : {},
          spec: r
        }));
      }).catch((g) => this.fail(c, g instanceof Error ? g : new Error(String(g))));
    }, d = this.lanes[s];
    return d.suspended ? d.held.push(l) : l(), this.join(h);
  }
  /** Hold a lane's new work while its view is hidden; nothing already sent is cancelled. */
  suspend(t) {
    this.lanes[t].suspended = !0;
  }
  resume(t) {
    const e = this.lanes[t];
    e.suspended = !1;
    for (const r of e.held.splice(0)) r();
  }
  dispose() {
    var t;
    this.disposed = !0;
    for (const e of [...this.pending.values()]) {
      this.settle(e);
      for (const r of e.waiters) r.reject(new w());
    }
    for (const e of Object.values(this.lanes))
      (t = e.worker) == null || t.terminate(), e.worker = null, e.opened.clear(), e.held.length = 0;
    for (const e of [...this.cache.keys()]) this.evict(e);
    for (const e of this.countLanes) e.worker.terminate();
    this.countLanes.length = 0;
    for (const e of this.classifying.values()) e.reject(new w());
    this.classifying.clear(), this.classifications.clear(), this.sources.clear(), this.sourceInfo.clear();
  }
  join(t) {
    let e = null;
    return {
      promise: new Promise((s, n) => {
        e = { resolve: s, reject: n }, t.waiters.push(e);
      }),
      cancel: () => {
        var n;
        if (!e || !this.pending.has(t.requestId)) return;
        const s = t.waiters.indexOf(e);
        s < 0 || (t.waiters.splice(s, 1), e.reject(new w()), !(t.waiters.length > 0) && (this.settle(t), t.sent && ((n = this.lanes[t.lane].worker) == null || n.postMessage(
          { protocol: p, type: "cancel", requestIds: [t.requestId] }
        ))));
      }
    };
  }
  cacheKey(t, e, r) {
    const s = (r.outline ? `|o${r.outline.slot ?? ""}:${r.outline.fraction ?? ""}` : "") + (r.grey && r.grey.length ? `|g${[...r.grey].sort((i, o) => i - o).join(",")}` : ""), n = `c${r.composite ? 1 : 0}|s${[...r.channels].sort((i, o) => i - o).join(",")}${s}`;
    return `${t}:${e}:${L(r, r.hop)}|${n}`;
  }
  /** The counting pool, grown to `size` workers on first need and kept for the next file. */
  countPool(t) {
    if (this.disposed) throw new Error("the image service has been disposed");
    for (; this.countLanes.length < t; ) {
      const e = this.factory("count"), r = { worker: e, opened: /* @__PURE__ */ new Map(), waiting: /* @__PURE__ */ new Set() };
      e.onmessage = (s) => {
        const n = s.data;
        if (n && n.protocol === p && (n.type === "source-ready" || n.type === "source-error")) {
          for (const i of [...r.waiting]) i(n);
          return;
        }
        this.receive(s.data);
      }, e.onerror = (s) => {
        var n;
        for (const [i, o] of [...this.classifying.entries()])
          (n = o.parts) != null && n.some((c) => c.lane === r) && (this.classifying.delete(i), this.cancelCount(o), o.reject(new Error(`an image worker failed${s != null && s.message ? `: ${s.message}` : ""}; reload the page if this persists`)));
      }, this.countLanes.push(r);
    }
    return this.countLanes.slice(0, t);
  }
  /** Open a file on a pool worker, without measuring it again: the scale travels with the count. */
  openOnCountLane(t, e) {
    const r = t.opened.get(e);
    if (r) return r;
    const s = this.sources.get(e);
    if (!s) return Promise.reject(new Error("no cell images are attached to this file"));
    let n;
    if (s.kind === "tiff-folder")
      if (s.handle) n = { kind: "tiff-folder", handle: s.handle, naming: s.naming };
      else if (s.files) n = { kind: "tiff-files", files: s.files };
      else return Promise.reject(new Error(`the cell images folder ${s.fileName} has not been found`));
    else {
      if (!s.file) return Promise.reject(new Error(`the cell images file ${s.fileName} has not been found`));
      n = { kind: "file", file: s.file };
    }
    const i = new Promise((o, c) => {
      const u = (h) => {
        h.type === "source-ready" && h.fileKey === e ? (t.waiting.delete(u), o()) : h.type === "source-error" && h.fileKey === e && (t.waiting.delete(u), t.opened.delete(e), c(new Error(h.message)));
      };
      t.waiting.add(u), t.worker.postMessage({
        protocol: p,
        type: "open-source",
        fileKey: e,
        source: n,
        eventCount: s.eventCount,
        scaleSample: 0
      });
    });
    return t.opened.set(e, i), i;
  }
  /** Tell every worker doing a share of this count to stop. */
  cancelCount(t) {
    var e;
    if (!t.parts) {
      (e = this.lanes.batch.worker) == null || e.postMessage({ protocol: p, type: "cancel", requestIds: [t.requestId] });
      return;
    }
    for (const r of t.parts)
      r.result || r.lane.worker.postMessage({ protocol: p, type: "cancel", requestIds: [r.requestId] });
  }
  /** The shares of a split count joined into one answer: each event from the share that counted it. */
  joinParts(t) {
    var i;
    const e = t[0].result, r = e.objectCount.slice(), s = e.objectArea.slice(), n = {};
    for (const [o, c] of Object.entries(e.features)) n[o] = c.slice();
    for (const o of t.slice(1)) {
      const c = o.result;
      r.set(c.objectCount.subarray(o.start, o.end), o.start), s.set(c.objectArea.subarray(o.start, o.end), o.start);
      for (const [u, h] of Object.entries(c.features)) (i = n[u]) == null || i.set(h.subarray(o.start, o.end), o.start);
    }
    return { objectCount: r, objectArea: s, features: n };
  }
  lane(t) {
    const e = this.lanes[t];
    if (!e.worker) {
      if (this.disposed) throw new Error("the image service has been disposed");
      const r = this.factory(t);
      r.onmessage = (s) => this.receive(s.data), r.onerror = (s) => {
        for (const n of [...this.pending.values()])
          n.lane === t && this.fail(n.requestId, new Error(`the image worker failed${s != null && s.message ? `: ${s.message}` : ""}; reload the page if this persists`));
      }, e.worker = r;
    }
    return e;
  }
  ensureOpen(t, e) {
    const r = this.lane(t), s = r.opened.get(e);
    if (s) return s;
    const n = this.sources.get(e);
    if (!n) return Promise.reject(new Error("no cell images are attached to this file"));
    let i;
    if (n.kind === "tiff-folder")
      if (n.handle) i = { kind: "tiff-folder", handle: n.handle, naming: n.naming };
      else if (n.files) i = { kind: "tiff-files", files: n.files };
      else return Promise.reject(new Error(`the cell images folder ${n.fileName} has not been found`));
    else {
      if (!n.file) return Promise.reject(new Error(`the cell images file ${n.fileName} has not been found`));
      i = { kind: "file", file: n.file };
    }
    const o = new Promise((c, u) => {
      const h = (l) => {
        if ((l.type === "source-ready" || l.type === "source-error") && l.fileKey === e && this.sources.get(e) !== n)
          this.sourceListeners.delete(h), u(new w());
        else if (l.type === "source-ready" && l.fileKey === e) {
          this.sourceListeners.delete(h);
          const d = A(l), g = this.sourceInfo.get(e) ?? d;
          this.sourceInfo.set(e, g), c(g);
        } else l.type === "source-error" && l.fileKey === e && (this.sourceListeners.delete(h), r.opened.delete(e), u(new Error(l.message)));
      };
      this.sourceListeners.add(h), r.worker.postMessage({
        protocol: p,
        type: "open-source",
        fileKey: e,
        source: i,
        eventCount: n.eventCount,
        ...this.sourceInfo.has(e) ? { scaleSample: 0 } : {}
      });
    });
    return r.opened.set(e, o), o;
  }
  receive(t) {
    var n;
    const e = t;
    if (!e || e.protocol !== p) return;
    if (e.type === "source-ready" || e.type === "source-error") {
      for (const i of [...this.sourceListeners]) i(e);
      return;
    }
    if (e.type === "classify-progress" || e.type === "classified") {
      const i = this.classifying.get(e.fileKey);
      if (!i) return;
      const o = (n = i.parts) == null ? void 0 : n.find((u) => u.requestId === e.requestId);
      if (o) {
        if (e.type === "classify-progress") {
          o.done = Math.max(0, Math.min(o.end, e.done) - o.start);
          const l = i.parts.reduce((d, g) => d + (g.result ? g.end - g.start : g.done), 0);
          for (const d of [...i.listeners]) d(l, e.total);
          return;
        }
        if (o.result = e, i.parts.some((l) => !l.result)) return;
        const u = this.joinParts(i.parts);
        this.classifications.set(e.fileKey, u), this.classifying.delete(e.fileKey);
        const h = u.objectCount.length;
        for (const l of [...i.listeners]) l(h, h);
        i.resolve(u);
        return;
      }
      if (i.requestId !== e.requestId) return;
      if (e.type === "classify-progress") {
        for (const u of [...i.listeners]) u(e.done, e.total);
        return;
      }
      const c = { objectCount: e.objectCount, objectArea: e.objectArea, features: e.features };
      this.classifications.set(e.fileKey, c), this.classifying.delete(e.fileKey), i.resolve(c);
      return;
    }
    const r = [...this.classifying.entries()].find(([, i]) => {
      var o;
      return i.requestId === e.requestId || ((o = i.parts) == null ? void 0 : o.some((c) => c.requestId === e.requestId));
    });
    if (r) {
      const [i, o] = r;
      this.classifying.delete(i), o.parts && this.cancelCount(o), o.reject(e.type === "cancelled" ? new w() : new Error(e.type === "error" ? e.message : "classification failed"));
      return;
    }
    const s = this.pending.get(e.requestId);
    if (!s) {
      e.type === "image" && C({ kind: "image", image: e });
      return;
    }
    if (this.settle(s), e.type === "image") {
      const i = { kind: "image", image: e };
      this.remember(s.cacheKey, i, B(e));
      for (const o of s.waiters) o.resolve(i);
    } else if (e.type === "no-image") {
      const i = { kind: "no-image" };
      this.remember(s.cacheKey, i, 0);
      for (const o of s.waiters) o.resolve(i);
    } else if (e.type === "cancelled")
      for (const i of s.waiters) i.reject(new w());
    else
      for (const i of s.waiters) i.reject(new Error(e.message));
  }
  settle(t) {
    t.timer && clearTimeout(t.timer), t.timer = null, this.pending.delete(t.requestId), this.inflight.get(t.cacheKey) === t && this.inflight.delete(t.cacheKey);
  }
  fail(t, e) {
    const r = this.pending.get(t);
    if (r) {
      this.settle(r);
      for (const s of r.waiters) s.reject(e);
    }
  }
  remember(t, e, r) {
    if (!(r > this.bitmapBudget)) {
      for (this.cache.has(t) && this.evict(t); this.cacheHeld + r > this.bitmapBudget && this.cache.size > 0; )
        this.evict(this.cache.keys().next().value);
      this.cache.set(t, { result: e, bytes: r }), this.cacheHeld += r;
    }
  }
  evict(t) {
    const e = this.cache.get(t);
    e && (this.cache.delete(t), this.cacheHeld -= e.bytes, C(e.result));
  }
}
export {
  W as ImageService,
  w as RenderCancelled
};
