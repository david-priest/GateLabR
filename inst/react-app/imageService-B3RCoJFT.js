var I = Object.defineProperty;
var j = (n, t, e) => t in n ? I(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var c = (n, t, e) => j(n, typeof t != "symbol" ? t + "" : t, e);
const p = "gatelab.cvw-worker.v1";
function b(n, t) {
  const e = n.display.map((i) => `${i.slot}:${i.enabled ? 1 : 0}:${i.colour}:${i.threshold}:${i.saturation}:${i.gamma}:${i.smoothing}:${n.scale[i.slot] ?? 1}`).join("|");
  return `h${t}|e${n.exposure}|${e}`;
}
class m extends Error {
  constructor() {
    super("render cancelled"), this.name = "RenderCancelled";
  }
}
const $ = 128 * 1024 * 1024, M = 1e4;
function E(n) {
  return new Worker(new URL(
    /* @vite-ignore */
    "" + new URL("assets/cvw.worker-B-jpvDsG.js", import.meta.url).href,
    import.meta.url
  ), { type: "module", name: `gatelab-images-${n}` });
}
function q(n) {
  return n.cols * n.rows * 4 * ((n.composite ? 1 : 0) + Object.keys(n.channels).length);
}
function y(n) {
  var t, e, i, s, r;
  if (n.kind === "image") {
    (i = (e = (t = n.image.composite) == null ? void 0 : t.bitmap) == null ? void 0 : e.close) == null || i.call(e);
    for (const o of Object.values(n.image.channels)) (r = (s = o.bitmap) == null ? void 0 : s.close) == null || r.call(s);
  }
}
function O(n) {
  return {
    eventCount: n.eventCount,
    imageCount: n.imageCount,
    hasImage: n.hasImage,
    scale: n.scale,
    channelNames: n.channelNames,
    pixelAspectRatio: n.pixelAspectRatio,
    recordingId: n.recordingId
  };
}
class B {
  constructor(t = {}) {
    c(this, "factory");
    c(this, "bitmapBudget");
    c(this, "timeoutMs");
    c(this, "lanes", {
      interactive: { worker: null, opened: /* @__PURE__ */ new Map(), suspended: !1, held: [] },
      batch: { worker: null, opened: /* @__PURE__ */ new Map(), suspended: !1, held: [] }
    });
    c(this, "sources", /* @__PURE__ */ new Map());
    c(this, "sourceInfo", /* @__PURE__ */ new Map());
    c(this, "sourceListeners", /* @__PURE__ */ new Set());
    c(this, "pending", /* @__PURE__ */ new Map());
    c(this, "inflight", /* @__PURE__ */ new Map());
    c(this, "classifications", /* @__PURE__ */ new Map());
    c(this, "classifying", /* @__PURE__ */ new Map());
    c(this, "cache", /* @__PURE__ */ new Map());
    c(this, "cacheHeld", 0);
    c(this, "hoverSeq", 0);
    c(this, "nextId", 0);
    c(this, "disposed", !1);
    this.factory = t.workerFactory ?? E, this.bitmapBudget = t.bitmapBudgetBytes ?? $, this.timeoutMs = t.timeoutMs ?? M;
  }
  /** Register a sample's source; the workers open it when a lane first needs it. */
  attach(t, e) {
    this.sources.get(t) !== e && (this.detach(t), this.sources.set(t, e));
  }
  detach(t) {
    var i;
    if (!this.sources.has(t)) return;
    this.sources.delete(t), this.sourceInfo.delete(t), this.classifications.delete(t);
    const e = this.classifying.get(t);
    e && (this.classifying.delete(t), e.reject(new m()));
    for (const s of Object.values(this.lanes))
      s.opened.delete(t), (i = s.worker) == null || i.postMessage({ protocol: p, type: "drop-source", fileKey: t });
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
    const i = this.classifications.get(t);
    if (i) return { promise: Promise.resolve(i), cancel: () => {
    } };
    let s = this.classifying.get(t);
    if (!s) {
      const a = `cls-${++this.nextId}`;
      let u, g;
      const f = new Promise((h, d) => {
        u = h, g = d;
      });
      f.catch(() => {
      }), s = { requestId: a, promise: f, resolve: u, reject: g, listeners: /* @__PURE__ */ new Set() }, this.classifying.set(t, s);
      const l = s;
      this.ensureOpen("batch", t).then(() => {
        var v, k;
        if (this.classifying.get(t) !== l) return;
        const h = ((v = this.sources.get(t)) == null ? void 0 : v.mask) ?? null, d = (k = this.sourceInfo.get(t)) == null ? void 0 : k.scale, w = { ...h ? { slot: h.slot, fraction: h.fraction } : {}, ...d ? { scale: d } : {} };
        this.lane("batch").worker.postMessage({
          protocol: p,
          type: "classify",
          requestId: a,
          fileKey: t,
          ...Object.keys(w).length ? { options: w } : {}
        });
      }).catch((h) => {
        this.classifying.get(t) === l && (this.classifying.delete(t), l.reject(h instanceof Error ? h : new Error(String(h))));
      });
    }
    const r = s;
    e && r.listeners.add(e);
    let o = !1;
    return {
      promise: r.promise,
      cancel: () => {
        var a;
        o || (o = !0, e && r.listeners.delete(e), !(r.listeners.size > 0 || this.classifying.get(t) !== r) && (this.classifying.delete(t), (a = this.lanes.batch.worker) == null || a.postMessage({ protocol: p, type: "cancel", requestIds: [r.requestId] }), r.reject(new m())));
      }
    };
  }
  /** The cached result for an event, when there is one, so a hover paints without a round trip. */
  cached(t, e, i) {
    const s = this.cacheKey(t, e, i), r = this.cache.get(s);
    return r ? (this.cache.delete(s), this.cache.set(s, r), r.result) : null;
  }
  /** Render one event. The same event under the same settings already in flight is shared. */
  render(t, e, i, s) {
    const r = this.cacheKey(t, e, i), o = this.cached(t, e, i);
    if (o) return { promise: Promise.resolve(o), cancel: () => {
    } };
    const a = this.inflight.get(r);
    if (a && a.lane === s) return this.join(a);
    const u = `img-${++this.nextId}`, g = s === "interactive" ? ++this.hoverSeq : void 0, f = { requestId: u, lane: s, cacheKey: r, waiters: [], timer: null, sent: !1 };
    this.pending.set(u, f), this.inflight.set(r, f);
    const l = () => {
      this.pending.has(u) && this.ensureOpen(s, t).then(() => {
        this.pending.has(u) && (f.sent = !0, this.timeoutMs > 0 && (f.timer = setTimeout(
          () => this.fail(u, new Error("the image worker did not answer; reload the page if this persists")),
          this.timeoutMs
        )), this.lane(s).worker.postMessage({
          protocol: p,
          type: "render",
          requestId: u,
          fileKey: t,
          eventIndex: e,
          lane: s,
          ...g !== void 0 ? { hoverSeq: g } : {},
          spec: i
        }));
      }).catch((d) => this.fail(u, d instanceof Error ? d : new Error(String(d))));
    }, h = this.lanes[s];
    return h.suspended ? h.held.push(l) : l(), this.join(f);
  }
  /** Hold a lane's new work while its view is hidden; nothing already sent is cancelled. */
  suspend(t) {
    this.lanes[t].suspended = !0;
  }
  resume(t) {
    const e = this.lanes[t];
    e.suspended = !1;
    for (const i of e.held.splice(0)) i();
  }
  dispose() {
    var t;
    this.disposed = !0;
    for (const e of [...this.pending.values()]) {
      this.settle(e);
      for (const i of e.waiters) i.reject(new m());
    }
    for (const e of Object.values(this.lanes))
      (t = e.worker) == null || t.terminate(), e.worker = null, e.opened.clear(), e.held.length = 0;
    for (const e of [...this.cache.keys()]) this.evict(e);
    for (const e of this.classifying.values()) e.reject(new m());
    this.classifying.clear(), this.classifications.clear(), this.sources.clear(), this.sourceInfo.clear();
  }
  join(t) {
    let e = null;
    return {
      promise: new Promise((s, r) => {
        e = { resolve: s, reject: r }, t.waiters.push(e);
      }),
      cancel: () => {
        var r;
        if (!e || !this.pending.has(t.requestId)) return;
        const s = t.waiters.indexOf(e);
        s < 0 || (t.waiters.splice(s, 1), e.reject(new m()), !(t.waiters.length > 0) && (this.settle(t), t.sent && ((r = this.lanes[t.lane].worker) == null || r.postMessage(
          { protocol: p, type: "cancel", requestIds: [t.requestId] }
        ))));
      }
    };
  }
  cacheKey(t, e, i) {
    const s = `c${i.composite ? 1 : 0}|s${[...i.channels].sort((r, o) => r - o).join(",")}`;
    return `${t}:${e}:${b(i, i.hop)}|${s}`;
  }
  lane(t) {
    const e = this.lanes[t];
    if (!e.worker) {
      if (this.disposed) throw new Error("the image service has been disposed");
      const i = this.factory(t);
      i.onmessage = (s) => this.receive(s.data), i.onerror = (s) => {
        for (const r of [...this.pending.values()])
          r.lane === t && this.fail(r.requestId, new Error(`the image worker failed${s != null && s.message ? `: ${s.message}` : ""}; reload the page if this persists`));
      }, e.worker = i;
    }
    return e;
  }
  ensureOpen(t, e) {
    const i = this.lane(t), s = i.opened.get(e);
    if (s) return s;
    const r = this.sources.get(e);
    if (!r) return Promise.reject(new Error("no cell images are attached to this file"));
    if (!r.file) return Promise.reject(new Error(`the cell images file ${r.fileName} has not been found`));
    const o = r.file, a = new Promise((u, g) => {
      const f = (l) => {
        if (l.type === "source-ready" && l.fileKey === e) {
          this.sourceListeners.delete(f);
          const h = O(l), d = this.sourceInfo.get(e) ?? h;
          this.sourceInfo.set(e, d), u(d);
        } else l.type === "source-error" && l.fileKey === e && (this.sourceListeners.delete(f), i.opened.delete(e), g(new Error(l.message)));
      };
      this.sourceListeners.add(f), i.worker.postMessage({
        protocol: p,
        type: "open-source",
        fileKey: e,
        source: { kind: "file", file: o },
        eventCount: r.eventCount,
        ...this.sourceInfo.has(e) ? { scaleSample: 0 } : {}
      });
    });
    return i.opened.set(e, a), a;
  }
  receive(t) {
    const e = t;
    if (!e || e.protocol !== p) return;
    if (e.type === "source-ready" || e.type === "source-error") {
      for (const r of [...this.sourceListeners]) r(e);
      return;
    }
    if (e.type === "classify-progress" || e.type === "classified") {
      const r = this.classifying.get(e.fileKey);
      if (!r || r.requestId !== e.requestId) return;
      if (e.type === "classify-progress") {
        for (const a of [...r.listeners]) a(e.done, e.total);
        return;
      }
      const o = { objectCount: e.objectCount, objectArea: e.objectArea };
      this.classifications.set(e.fileKey, o), this.classifying.delete(e.fileKey), r.resolve(o);
      return;
    }
    const i = [...this.classifying.entries()].find(([, r]) => r.requestId === e.requestId);
    if (i) {
      const [r, o] = i;
      this.classifying.delete(r), o.reject(e.type === "cancelled" ? new m() : new Error(e.type === "error" ? e.message : "classification failed"));
      return;
    }
    const s = this.pending.get(e.requestId);
    if (!s) {
      e.type === "image" && y({ kind: "image", image: e });
      return;
    }
    if (this.settle(s), e.type === "image") {
      const r = { kind: "image", image: e };
      this.remember(s.cacheKey, r, q(e));
      for (const o of s.waiters) o.resolve(r);
    } else if (e.type === "no-image") {
      const r = { kind: "no-image" };
      this.remember(s.cacheKey, r, 0);
      for (const o of s.waiters) o.resolve(r);
    } else if (e.type === "cancelled")
      for (const r of s.waiters) r.reject(new m());
    else
      for (const r of s.waiters) r.reject(new Error(e.message));
  }
  settle(t) {
    t.timer && clearTimeout(t.timer), t.timer = null, this.pending.delete(t.requestId), this.inflight.get(t.cacheKey) === t && this.inflight.delete(t.cacheKey);
  }
  fail(t, e) {
    const i = this.pending.get(t);
    if (i) {
      this.settle(i);
      for (const s of i.waiters) s.reject(e);
    }
  }
  remember(t, e, i) {
    if (!(i > this.bitmapBudget)) {
      for (this.cache.has(t) && this.evict(t); this.cacheHeld + i > this.bitmapBudget && this.cache.size > 0; )
        this.evict(this.cache.keys().next().value);
      this.cache.set(t, { result: e, bytes: i }), this.cacheHeld += i;
    }
  }
  evict(t) {
    const e = this.cache.get(t);
    e && (this.cache.delete(t), this.cacheHeld -= e.bytes, y(e.result));
  }
}
export {
  B as ImageService,
  m as RenderCancelled
};
