var I = Object.defineProperty;
var j = (n, t, e) => t in n ? I(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var a = (n, t, e) => j(n, typeof t != "symbol" ? t + "" : t, e);
const m = "gatelab.cvw-worker.v1";
function $(n, t) {
  const e = n.display.map((i) => `${i.slot}:${i.enabled ? 1 : 0}:${i.colour}:${i.threshold}:${i.saturation}:${i.gamma}:${i.smoothing}:${n.scale[i.slot] ?? 1}`).join("|");
  return `h${t}|e${n.exposure}|${e}`;
}
class p extends Error {
  constructor() {
    super("render cancelled"), this.name = "RenderCancelled";
  }
}
const b = 128 * 1024 * 1024, M = 1e4;
function E(n) {
  return new Worker(new URL(
    /* @vite-ignore */
    "" + new URL("assets/cvw.worker-PURwuGNr.js", import.meta.url).href,
    import.meta.url
  ), { type: "module", name: `gatelab-images-${n}` });
}
function q(n) {
  return n.cols * n.rows * 4 * ((n.composite ? 1 : 0) + Object.keys(n.channels).length);
}
function v(n) {
  var t, e, i, r, s;
  if (n.kind === "image") {
    (i = (e = (t = n.image.composite) == null ? void 0 : t.bitmap) == null ? void 0 : e.close) == null || i.call(e);
    for (const o of Object.values(n.image.channels)) (s = (r = o.bitmap) == null ? void 0 : r.close) == null || s.call(r);
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
class R {
  constructor(t = {}) {
    a(this, "factory");
    a(this, "bitmapBudget");
    a(this, "timeoutMs");
    a(this, "lanes", {
      interactive: { worker: null, opened: /* @__PURE__ */ new Map(), suspended: !1, held: [] },
      batch: { worker: null, opened: /* @__PURE__ */ new Map(), suspended: !1, held: [] }
    });
    a(this, "sources", /* @__PURE__ */ new Map());
    a(this, "sourceInfo", /* @__PURE__ */ new Map());
    a(this, "sourceListeners", /* @__PURE__ */ new Set());
    a(this, "pending", /* @__PURE__ */ new Map());
    a(this, "inflight", /* @__PURE__ */ new Map());
    a(this, "classifications", /* @__PURE__ */ new Map());
    a(this, "classifying", /* @__PURE__ */ new Map());
    a(this, "cache", /* @__PURE__ */ new Map());
    a(this, "cacheHeld", 0);
    a(this, "hoverSeq", 0);
    a(this, "nextId", 0);
    a(this, "disposed", !1);
    this.factory = t.workerFactory ?? E, this.bitmapBudget = t.bitmapBudgetBytes ?? b, this.timeoutMs = t.timeoutMs ?? M;
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
    e && (this.classifying.delete(t), e.reject(new p()));
    for (const r of Object.values(this.lanes))
      r.opened.delete(t), (i = r.worker) == null || i.postMessage({ protocol: m, type: "drop-source", fileKey: t });
    for (const r of [...this.cache.keys()])
      r.startsWith(`${t}:`) && this.evict(r);
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
    let r = this.classifying.get(t);
    if (!r) {
      const c = `cls-${++this.nextId}`;
      let u, g;
      const f = new Promise((l, d) => {
        u = l, g = d;
      });
      f.catch(() => {
      }), r = { requestId: c, promise: f, resolve: u, reject: g, listeners: /* @__PURE__ */ new Set() }, this.classifying.set(t, r);
      const h = r;
      this.ensureOpen("batch", t).then(() => {
        var k, y;
        if (this.classifying.get(t) !== h) return;
        const l = ((k = this.sources.get(t)) == null ? void 0 : k.mask) ?? null, d = (y = this.sourceInfo.get(t)) == null ? void 0 : y.scale, w = { ...l ? { slot: l.slot, fraction: l.fraction } : {}, ...d ? { scale: d } : {} };
        this.lane("batch").worker.postMessage({
          protocol: m,
          type: "classify",
          requestId: c,
          fileKey: t,
          ...Object.keys(w).length ? { options: w } : {}
        });
      }).catch((l) => {
        this.classifying.get(t) === h && (this.classifying.delete(t), h.reject(l instanceof Error ? l : new Error(String(l))));
      });
    }
    const s = r;
    e && s.listeners.add(e);
    let o = !1;
    return {
      promise: s.promise,
      cancel: () => {
        var c;
        o || (o = !0, e && s.listeners.delete(e), !(s.listeners.size > 0 || this.classifying.get(t) !== s) && (this.classifying.delete(t), (c = this.lanes.batch.worker) == null || c.postMessage({ protocol: m, type: "cancel", requestIds: [s.requestId] }), s.reject(new p())));
      }
    };
  }
  /** The cached result for an event, when there is one, so a hover paints without a round trip. */
  cached(t, e, i) {
    const r = this.cacheKey(t, e, i), s = this.cache.get(r);
    return s ? (this.cache.delete(r), this.cache.set(r, s), s.result) : null;
  }
  /** Render one event. The same event under the same settings already in flight is shared. */
  render(t, e, i, r) {
    const s = this.cacheKey(t, e, i), o = this.cached(t, e, i);
    if (o) return { promise: Promise.resolve(o), cancel: () => {
    } };
    const c = this.inflight.get(s);
    if (c && c.lane === r) return this.join(c);
    const u = `img-${++this.nextId}`, g = r === "interactive" ? ++this.hoverSeq : void 0, f = { requestId: u, lane: r, cacheKey: s, waiters: [], timer: null, sent: !1 };
    this.pending.set(u, f), this.inflight.set(s, f);
    const h = () => {
      this.pending.has(u) && this.ensureOpen(r, t).then(() => {
        this.pending.has(u) && (f.sent = !0, this.timeoutMs > 0 && (f.timer = setTimeout(
          () => this.fail(u, new Error("the image worker did not answer; reload the page if this persists")),
          this.timeoutMs
        )), this.lane(r).worker.postMessage({
          protocol: m,
          type: "render",
          requestId: u,
          fileKey: t,
          eventIndex: e,
          lane: r,
          ...g !== void 0 ? { hoverSeq: g } : {},
          spec: i
        }));
      }).catch((d) => this.fail(u, d instanceof Error ? d : new Error(String(d))));
    }, l = this.lanes[r];
    return l.suspended ? l.held.push(h) : h(), this.join(f);
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
      for (const i of e.waiters) i.reject(new p());
    }
    for (const e of Object.values(this.lanes))
      (t = e.worker) == null || t.terminate(), e.worker = null, e.opened.clear(), e.held.length = 0;
    for (const e of [...this.cache.keys()]) this.evict(e);
    for (const e of this.classifying.values()) e.reject(new p());
    this.classifying.clear(), this.classifications.clear(), this.sources.clear(), this.sourceInfo.clear();
  }
  join(t) {
    let e = null;
    return {
      promise: new Promise((r, s) => {
        e = { resolve: r, reject: s }, t.waiters.push(e);
      }),
      cancel: () => {
        var s;
        if (!e || !this.pending.has(t.requestId)) return;
        const r = t.waiters.indexOf(e);
        r < 0 || (t.waiters.splice(r, 1), e.reject(new p()), !(t.waiters.length > 0) && (this.settle(t), t.sent && ((s = this.lanes[t.lane].worker) == null || s.postMessage(
          { protocol: m, type: "cancel", requestIds: [t.requestId] }
        ))));
      }
    };
  }
  cacheKey(t, e, i) {
    const r = (i.outline ? `|o${i.outline.slot ?? ""}:${i.outline.fraction ?? ""}` : "") + (i.grey && i.grey.length ? `|g${[...i.grey].sort((o, c) => o - c).join(",")}` : ""), s = `c${i.composite ? 1 : 0}|s${[...i.channels].sort((o, c) => o - c).join(",")}${r}`;
    return `${t}:${e}:${$(i, i.hop)}|${s}`;
  }
  lane(t) {
    const e = this.lanes[t];
    if (!e.worker) {
      if (this.disposed) throw new Error("the image service has been disposed");
      const i = this.factory(t);
      i.onmessage = (r) => this.receive(r.data), i.onerror = (r) => {
        for (const s of [...this.pending.values()])
          s.lane === t && this.fail(s.requestId, new Error(`the image worker failed${r != null && r.message ? `: ${r.message}` : ""}; reload the page if this persists`));
      }, e.worker = i;
    }
    return e;
  }
  ensureOpen(t, e) {
    const i = this.lane(t), r = i.opened.get(e);
    if (r) return r;
    const s = this.sources.get(e);
    if (!s) return Promise.reject(new Error("no cell images are attached to this file"));
    let o;
    if (s.kind === "tiff-folder")
      if (s.handle) o = { kind: "tiff-folder", handle: s.handle, naming: s.naming };
      else if (s.files) o = { kind: "tiff-files", files: s.files };
      else return Promise.reject(new Error(`the cell images folder ${s.fileName} has not been found`));
    else {
      if (!s.file) return Promise.reject(new Error(`the cell images file ${s.fileName} has not been found`));
      o = { kind: "file", file: s.file };
    }
    const c = new Promise((u, g) => {
      const f = (h) => {
        if (h.type === "source-ready" && h.fileKey === e) {
          this.sourceListeners.delete(f);
          const l = O(h), d = this.sourceInfo.get(e) ?? l;
          this.sourceInfo.set(e, d), u(d);
        } else h.type === "source-error" && h.fileKey === e && (this.sourceListeners.delete(f), i.opened.delete(e), g(new Error(h.message)));
      };
      this.sourceListeners.add(f), i.worker.postMessage({
        protocol: m,
        type: "open-source",
        fileKey: e,
        source: o,
        eventCount: s.eventCount,
        ...this.sourceInfo.has(e) ? { scaleSample: 0 } : {}
      });
    });
    return i.opened.set(e, c), c;
  }
  receive(t) {
    const e = t;
    if (!e || e.protocol !== m) return;
    if (e.type === "source-ready" || e.type === "source-error") {
      for (const s of [...this.sourceListeners]) s(e);
      return;
    }
    if (e.type === "classify-progress" || e.type === "classified") {
      const s = this.classifying.get(e.fileKey);
      if (!s || s.requestId !== e.requestId) return;
      if (e.type === "classify-progress") {
        for (const c of [...s.listeners]) c(e.done, e.total);
        return;
      }
      const o = { objectCount: e.objectCount, objectArea: e.objectArea, features: e.features };
      this.classifications.set(e.fileKey, o), this.classifying.delete(e.fileKey), s.resolve(o);
      return;
    }
    const i = [...this.classifying.entries()].find(([, s]) => s.requestId === e.requestId);
    if (i) {
      const [s, o] = i;
      this.classifying.delete(s), o.reject(e.type === "cancelled" ? new p() : new Error(e.type === "error" ? e.message : "classification failed"));
      return;
    }
    const r = this.pending.get(e.requestId);
    if (!r) {
      e.type === "image" && v({ kind: "image", image: e });
      return;
    }
    if (this.settle(r), e.type === "image") {
      const s = { kind: "image", image: e };
      this.remember(r.cacheKey, s, q(e));
      for (const o of r.waiters) o.resolve(s);
    } else if (e.type === "no-image") {
      const s = { kind: "no-image" };
      this.remember(r.cacheKey, s, 0);
      for (const o of r.waiters) o.resolve(s);
    } else if (e.type === "cancelled")
      for (const s of r.waiters) s.reject(new p());
    else
      for (const s of r.waiters) s.reject(new Error(e.message));
  }
  settle(t) {
    t.timer && clearTimeout(t.timer), t.timer = null, this.pending.delete(t.requestId), this.inflight.get(t.cacheKey) === t && this.inflight.delete(t.cacheKey);
  }
  fail(t, e) {
    const i = this.pending.get(t);
    if (i) {
      this.settle(i);
      for (const r of i.waiters) r.reject(e);
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
    e && (this.cache.delete(t), this.cacheHeld -= e.bytes, v(e.result));
  }
}
export {
  R as ImageService,
  p as RenderCancelled
};
