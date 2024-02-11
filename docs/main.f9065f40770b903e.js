"use strict";
(self.webpackChunkamanda = self.webpackChunkamanda || []).push([
  [179],
  {
    407: () => {
      function te(e) {
        return "function" == typeof e;
      }
      function Gr(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const ao = Gr(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function Wr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class st {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const o of n) o.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (te(r))
              try {
                r();
              } catch (o) {
                t = o instanceof ao ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  Cd(o);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof ao ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new ao(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Cd(t);
            else {
              if (t instanceof st) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && Wr(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && Wr(n, t), t instanceof st && t._removeParent(this);
        }
      }
      st.EMPTY = (() => {
        const e = new st();
        return (e.closed = !0), e;
      })();
      const wd = st.EMPTY;
      function _d(e) {
        return (
          e instanceof st ||
          (e && "closed" in e && te(e.remove) && te(e.add) && te(e.unsubscribe))
        );
      }
      function Cd(e) {
        te(e) ? e() : e.unsubscribe();
      }
      const Sn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        uo = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = uo;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = uo;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Ed(e) {
        uo.setTimeout(() => {
          const { onUnhandledError: t } = Sn;
          if (!t) throw e;
          t(e);
        });
      }
      function bd() {}
      const zD = da("C", void 0, void 0);
      function da(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Mn = null;
      function lo(e) {
        if (Sn.useDeprecatedSynchronousErrorHandling) {
          const t = !Mn;
          if ((t && (Mn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Mn;
            if (((Mn = null), n)) throw r;
          }
        } else e();
      }
      class fa extends st {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), _d(t) && t.add(this))
              : (this.destination = YD);
        }
        static create(t, n, r) {
          return new qr(t, n, r);
        }
        next(t) {
          this.isStopped
            ? pa(
                (function WD(e) {
                  return da("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? pa(
                (function GD(e) {
                  return da("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? pa(zD, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const QD = Function.prototype.bind;
      function ha(e, t) {
        return QD.call(e, t);
      }
      class ZD {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              co(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              co(r);
            }
          else co(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              co(n);
            }
        }
      }
      class qr extends fa {
        constructor(t, n, r) {
          let i;
          if ((super(), te(t) || !t))
            i = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let o;
            this && Sn.useDeprecatedNextContext
              ? ((o = Object.create(t)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: t.next && ha(t.next, o),
                  error: t.error && ha(t.error, o),
                  complete: t.complete && ha(t.complete, o),
                }))
              : (i = t);
          }
          this.destination = new ZD(i);
        }
      }
      function co(e) {
        Sn.useDeprecatedSynchronousErrorHandling
          ? (function qD(e) {
              Sn.useDeprecatedSynchronousErrorHandling &&
                Mn &&
                ((Mn.errorThrown = !0), (Mn.error = e));
            })(e)
          : Ed(e);
      }
      function pa(e, t) {
        const { onStoppedNotification: n } = Sn;
        n && uo.setTimeout(() => n(e, t));
      }
      const YD = {
          closed: !0,
          next: bd,
          error: function KD(e) {
            throw e;
          },
          complete: bd,
        },
        ga =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Tn(e) {
        return e;
      }
      function Id(e) {
        return 0 === e.length
          ? Tn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, i) => i(r), n);
            };
      }
      let De = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, i) {
            const o = (function ew(e) {
              return (
                (e && e instanceof fa) ||
                ((function XD(e) {
                  return e && te(e.next) && te(e.error) && te(e.complete);
                })(e) &&
                  _d(e))
              );
            })(n)
              ? n
              : new qr(n, r, i);
            return (
              lo(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Sd(r))((i, o) => {
              const s = new qr({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    o(u), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ga]() {
            return this;
          }
          pipe(...n) {
            return Id(n)(this);
          }
          toPromise(n) {
            return new (n = Sd(n))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Sd(e) {
        var t;
        return null !== (t = e ?? Sn.Promise) && void 0 !== t ? t : Promise;
      }
      const tw = Gr(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Tt = (() => {
        class e extends De {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Md(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new tw();
          }
          next(n) {
            lo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            lo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            lo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? wd
              : ((this.currentObservers = null),
                o.push(n),
                new st(() => {
                  (this.currentObservers = null), Wr(o, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? n.error(i) : o && n.complete();
          }
          asObservable() {
            const n = new De();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Md(t, n)), e;
      })();
      class Md extends Tt {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : wd;
        }
      }
      function Td(e) {
        return te(e?.lift);
      }
      function Me(e) {
        return (t) => {
          if (Td(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Te(e, t, n, r, i) {
        return new nw(e, t, n, r, i);
      }
      class nw extends fa {
        constructor(t, n, r, i, o, s) {
          super(t),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function Q(e, t) {
        return Me((n, r) => {
          let i = 0;
          n.subscribe(
            Te(r, (o) => {
              r.next(e.call(t, o, i++));
            })
          );
        });
      }
      function sn(e) {
        return this instanceof sn ? ((this.v = e), this) : new sn(e);
      }
      function Rd(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var i,
          r = n.apply(e, t || []),
          o = [];
        return (
          (i = {}),
          s("next"),
          s("throw"),
          s("return"),
          (i[Symbol.asyncIterator] = function () {
            return this;
          }),
          i
        );
        function s(f) {
          r[f] &&
            (i[f] = function (h) {
              return new Promise(function (p, g) {
                o.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof sn
                ? Promise.resolve(f.value.v).then(l, c)
                : d(o[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(o[0][3], p);
          }
        }
        function l(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      }
      function Nd(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Da(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(o) {
          n[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function i(o, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    o({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const Pd = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Fd(e) {
        return te(e?.then);
      }
      function Od(e) {
        return te(e[ga]);
      }
      function kd(e) {
        return Symbol.asyncIterator && te(e?.[Symbol.asyncIterator]);
      }
      function Ld(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const jd = (function bw() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Vd(e) {
        return te(e?.[jd]);
      }
      function $d(e) {
        return Rd(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield sn(n.read());
              if (i) return yield sn(void 0);
              yield yield sn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Bd(e) {
        return te(e?.getReader);
      }
      function At(e) {
        if (e instanceof De) return e;
        if (null != e) {
          if (Od(e))
            return (function Iw(e) {
              return new De((t) => {
                const n = e[ga]();
                if (te(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (Pd(e))
            return (function Sw(e) {
              return new De((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Fd(e))
            return (function Mw(e) {
              return new De((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Ed);
              });
            })(e);
          if (kd(e)) return Hd(e);
          if (Vd(e))
            return (function Tw(e) {
              return new De((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Bd(e))
            return (function Aw(e) {
              return Hd($d(e));
            })(e);
        }
        throw Ld(e);
      }
      function Hd(e) {
        return new De((t) => {
          (function xw(e, t) {
            var n, r, i, o;
            return (function Ad(e, t, n, r) {
              return new (n || (n = Promise))(function (o, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? o(c.value)
                    : (function i(o) {
                        return o instanceof n
                          ? o
                          : new n(function (s) {
                              s(o);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Nd(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = n.return) && (yield o.call(n));
                } finally {
                  if (i) throw i.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function Vt(e, t, n, r = 0, i = !1) {
        const o = t.schedule(function () {
          n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(o), !i)) return o;
      }
      function xe(e, t, n = 1 / 0) {
        return te(t)
          ? xe((r, i) => Q((o, s) => t(r, o, i, s))(At(e(r, i))), n)
          : ("number" == typeof t && (n = t),
            Me((r, i) =>
              (function Rw(e, t, n, r, i, o, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    o && t.next(g), l++;
                    let m = !1;
                    At(n(g, c++)).subscribe(
                      Te(
                        t,
                        (C) => {
                          i?.(C), o ? h(C) : t.next(C);
                        },
                        () => {
                          m = !0;
                        },
                        void 0,
                        () => {
                          if (m)
                            try {
                              for (l--; u.length && l < r; ) {
                                const C = u.shift();
                                s ? Vt(t, s, () => p(C)) : p(C);
                              }
                              f();
                            } catch (C) {
                              t.error(C);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Te(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, i, e, n)
            ));
      }
      function Yn(e = 1 / 0) {
        return xe(Tn, e);
      }
      const $t = new De((e) => e.complete());
      function wa(e) {
        return e[e.length - 1];
      }
      function Qr(e) {
        return (function Pw(e) {
          return e && te(e.schedule);
        })(wa(e))
          ? e.pop()
          : void 0;
      }
      function Ud(e, t = 0) {
        return Me((n, r) => {
          n.subscribe(
            Te(
              r,
              (i) => Vt(r, e, () => r.next(i), t),
              () => Vt(r, e, () => r.complete(), t),
              (i) => Vt(r, e, () => r.error(i), t)
            )
          );
        });
      }
      function zd(e, t = 0) {
        return Me((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Gd(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new De((n) => {
          Vt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Vt(
              n,
              t,
              () => {
                r.next().then((i) => {
                  i.done ? n.complete() : n.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function we(e, t) {
        return t
          ? (function Bw(e, t) {
              if (null != e) {
                if (Od(e))
                  return (function kw(e, t) {
                    return At(e).pipe(zd(t), Ud(t));
                  })(e, t);
                if (Pd(e))
                  return (function jw(e, t) {
                    return new De((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Fd(e))
                  return (function Lw(e, t) {
                    return At(e).pipe(zd(t), Ud(t));
                  })(e, t);
                if (kd(e)) return Gd(e, t);
                if (Vd(e))
                  return (function Vw(e, t) {
                    return new De((n) => {
                      let r;
                      return (
                        Vt(n, t, () => {
                          (r = e[jd]()),
                            Vt(
                              n,
                              t,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                o ? n.complete() : n.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => te(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Bd(e))
                  return (function $w(e, t) {
                    return Gd($d(e), t);
                  })(e, t);
              }
              throw Ld(e);
            })(e, t)
          : At(e);
      }
      function _a(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new qr({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return t(...n).subscribe(r);
      }
      function X(e) {
        for (let t in e) if (e[t] === X) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function ee(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(ee).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Ea(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const zw = X({ __forward_ref__: X });
      function ba(e) {
        return (
          (e.__forward_ref__ = ba),
          (e.toString = function () {
            return ee(this());
          }),
          e
        );
      }
      function F(e) {
        return (function Ia(e) {
          return (
            "function" == typeof e &&
            e.hasOwnProperty(zw) &&
            e.__forward_ref__ === ba
          );
        })(e)
          ? e()
          : e;
      }
      class S extends Error {
        constructor(t, n) {
          super(
            (function fo(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function L(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function ho(e, t) {
        throw new S(-201, !1);
      }
      function Je(e, t) {
        null == e &&
          (function Y(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function H(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function an(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function po(e) {
        return Wd(e, go) || Wd(e, Qd);
      }
      function Wd(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function qd(e) {
        return e && (e.hasOwnProperty(Sa) || e.hasOwnProperty(Xw))
          ? e[Sa]
          : null;
      }
      const go = X({ ɵprov: X }),
        Sa = X({ ɵinj: X }),
        Qd = X({ ngInjectableDef: X }),
        Xw = X({ ngInjectorDef: X });
      var N = (() => (
        ((N = N || {})[(N.Default = 0)] = "Default"),
        (N[(N.Host = 1)] = "Host"),
        (N[(N.Self = 2)] = "Self"),
        (N[(N.SkipSelf = 4)] = "SkipSelf"),
        (N[(N.Optional = 8)] = "Optional"),
        N
      ))();
      let Ma;
      function at(e) {
        const t = Ma;
        return (Ma = e), t;
      }
      function Zd(e, t, n) {
        const r = po(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & N.Optional
          ? null
          : void 0 !== t
          ? t
          : void ho(ee(e));
      }
      function un(e) {
        return { toString: e }.toString();
      }
      var pt = (() => (
          ((pt = pt || {})[(pt.OnPush = 0)] = "OnPush"),
          (pt[(pt.Default = 1)] = "Default"),
          pt
        ))(),
        xt = (() => {
          return (
            ((e = xt || (xt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            xt
          );
          var e;
        })();
      const ne = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        Jn = {},
        K = [],
        mo = X({ ɵcmp: X }),
        Ta = X({ ɵdir: X }),
        Aa = X({ ɵpipe: X }),
        Kd = X({ ɵmod: X }),
        Ht = X({ ɵfac: X }),
        Zr = X({ __NG_ELEMENT_ID__: X });
      let t_ = 0;
      function Ut(e) {
        return un(() => {
          const n = !0 === e.standalone,
            r = {},
            i = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === pt.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || K,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || xt.Emulated,
              id: "c" + t_++,
              styles: e.styles || K,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            o = e.dependencies,
            s = e.features;
          return (
            (i.inputs = Xd(e.inputs, r)),
            (i.outputs = Xd(e.outputs)),
            s && s.forEach((a) => a(i)),
            (i.directiveDefs = o
              ? () => ("function" == typeof o ? o() : o).map(Yd).filter(Jd)
              : null),
            (i.pipeDefs = o
              ? () => ("function" == typeof o ? o() : o).map(Ve).filter(Jd)
              : null),
            i
          );
        });
      }
      function Yd(e) {
        return J(e) || je(e);
      }
      function Jd(e) {
        return null !== e;
      }
      function An(e) {
        return un(() => ({
          type: e.type,
          bootstrap: e.bootstrap || K,
          declarations: e.declarations || K,
          imports: e.imports || K,
          exports: e.exports || K,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Xd(e, t) {
        if (null == e) return Jn;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let i = e[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (n[i] = r),
              t && (t[i] = o);
          }
        return n;
      }
      const Ne = Ut;
      function J(e) {
        return e[mo] || null;
      }
      function je(e) {
        return e[Ta] || null;
      }
      function Ve(e) {
        return e[Aa] || null;
      }
      function Xe(e, t) {
        const n = e[Kd] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${ee(e)} does not have '\u0275mod' property.`);
        return n;
      }
      const $ = 11;
      function qe(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function mt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function Na(e) {
        return 0 != (8 & e.flags);
      }
      function wo(e) {
        return 2 == (2 & e.flags);
      }
      function _o(e) {
        return 1 == (1 & e.flags);
      }
      function yt(e) {
        return null !== e.template;
      }
      function a_(e) {
        return 0 != (256 & e[2]);
      }
      function Fn(e, t) {
        return e.hasOwnProperty(Ht) ? e[Ht] : null;
      }
      class c_ {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function nf(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = f_), d_;
      }
      function d_() {
        const e = sf(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === Jn) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function f_(e, t, n, r) {
        const i =
            sf(e) ||
            (function h_(e, t) {
              return (e[rf] = t);
            })(e, { previous: Jn, current: null }),
          o = i.current || (i.current = {}),
          s = i.previous,
          a = this.declaredInputs[n],
          u = s[a];
        (o[a] = new c_(u && u.currentValue, t, s === Jn)), (e[r] = t);
      }
      const rf = "__ngSimpleChanges__";
      function sf(e) {
        return e[rf] || null;
      }
      function ge(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function tt(e, t) {
        return ge(t[e.index]);
      }
      function La(e, t) {
        return e.data[t];
      }
      function nt(e, t) {
        const n = t[e];
        return qe(n) ? n : n[0];
      }
      function Eo(e) {
        return 64 == (64 & e[2]);
      }
      function ln(e, t) {
        return null == t ? null : e[t];
      }
      function af(e) {
        e[18] = 0;
      }
      function ja(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const k = { lFrame: Df(null), bindingsEnabled: !0 };
      function lf() {
        return k.bindingsEnabled;
      }
      function w() {
        return k.lFrame.lView;
      }
      function W() {
        return k.lFrame.tView;
      }
      function _e() {
        let e = ff();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function ff() {
        return k.lFrame.currentTNode;
      }
      function Rt(e, t) {
        const n = k.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Va() {
        return k.lFrame.isParent;
      }
      function ir() {
        return k.lFrame.bindingIndex++;
      }
      function T_(e, t) {
        const n = k.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Ba(t);
      }
      function Ba(e) {
        k.lFrame.currentDirectiveIndex = e;
      }
      function Ua(e) {
        k.lFrame.currentQueryIndex = e;
      }
      function x_(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function yf(e, t, n) {
        if (n & N.SkipSelf) {
          let i = t,
            o = e;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              n & N.Host ||
              ((i = x_(o)), null === i || ((o = o[15]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (e = o);
        }
        const r = (k.lFrame = vf());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function za(e) {
        const t = vf(),
          n = e[1];
        (k.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function vf() {
        const e = k.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Df(e) : t;
      }
      function Df(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function wf() {
        const e = k.lFrame;
        return (
          (k.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const _f = wf;
      function Ga() {
        const e = wf();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Be() {
        return k.lFrame.selectedIndex;
      }
      function cn(e) {
        k.lFrame.selectedIndex = e;
      }
      function bo(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const o = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = o;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            l &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, l),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Io(e, t, n) {
        Cf(e, t, 3, n);
      }
      function So(e, t, n, r) {
        (3 & e[2]) === n && Cf(e, t, n, r);
      }
      function Wa(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function Cf(e, t, n, r) {
        const o = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[18] += 65536),
              (a < o || -1 == o) &&
                (V_(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)),
              u++;
      }
      function V_(e, t, n, r) {
        const i = n[r] < 0,
          o = n[r + 1],
          a = e[i ? -n[r] : n[r]];
        if (i) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              o.call(a);
            } finally {
            }
          }
        } else
          try {
            o.call(a);
          } finally {
          }
      }
      class ti {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Mo(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const i = n[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, o);
          } else {
            const o = i,
              s = n[++r];
            bf(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), r++;
          }
        }
        return r;
      }
      function Ef(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function bf(e) {
        return 64 === e.charCodeAt(0);
      }
      function To(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const i = t[r];
              "number" == typeof i
                ? (n = i)
                : 0 === n ||
                  If(e, n, i, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function If(e, t, n, r, i) {
        let o = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== i && (e[o + 1] = i));
            if (r === e[o + 1]) return void (e[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (e.splice(s, 0, t), (o = s + 1)),
          e.splice(o++, 0, n),
          null !== r && e.splice(o++, 0, r),
          null !== i && e.splice(o++, 0, i);
      }
      function Sf(e) {
        return -1 !== e;
      }
      function or(e) {
        return 32767 & e;
      }
      function sr(e, t) {
        let n = (function z_(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let Qa = !0;
      function Ao(e) {
        const t = Qa;
        return (Qa = e), t;
      }
      let G_ = 0;
      const Nt = {};
      function ri(e, t) {
        const n = Ka(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Za(r.data, e),
          Za(t, null),
          Za(r.blueprint, null));
        const i = xo(e, t),
          o = e.injectorIndex;
        if (Sf(i)) {
          const s = or(i),
            a = sr(i, t),
            u = a[1].data;
          for (let l = 0; l < 8; l++) t[o + l] = a[s + l] | u[s + l];
        }
        return (t[o + 8] = i), o;
      }
      function Za(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Ka(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function xo(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          i = t;
        for (; null !== i; ) {
          if (((r = Of(i)), null === r)) return -1;
          if ((n++, (i = i[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function Ro(e, t, n) {
        !(function W_(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Zr) && (r = n[Zr]),
            null == r && (r = n[Zr] = G_++);
          const i = 255 & r;
          t.data[e + (i >> 5)] |= 1 << i;
        })(e, t, n);
      }
      function Af(e, t, n) {
        if (n & N.Optional || void 0 !== e) return e;
        ho();
      }
      function xf(e, t, n, r) {
        if (
          (n & N.Optional && void 0 === r && (r = null),
          0 == (n & (N.Self | N.Host)))
        ) {
          const i = e[9],
            o = at(void 0);
          try {
            return i ? i.get(t, r, n & N.Optional) : Zd(t, r, n & N.Optional);
          } finally {
            at(o);
          }
        }
        return Af(r, 0, n);
      }
      function Rf(e, t, n, r = N.Default, i) {
        if (null !== e) {
          if (1024 & t[2]) {
            const s = (function J_(e, t, n, r, i) {
              let o = e,
                s = t;
              for (
                ;
                null !== o && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = Nf(o, s, n, r | N.Self, Nt);
                if (a !== Nt) return a;
                let u = o.parent;
                if (!u) {
                  const l = s[21];
                  if (l) {
                    const c = l.get(n, Nt, r);
                    if (c !== Nt) return c;
                  }
                  (u = Of(s)), (s = s[15]);
                }
                o = u;
              }
              return i;
            })(e, t, n, r, Nt);
            if (s !== Nt) return s;
          }
          const o = Nf(e, t, n, r, Nt);
          if (o !== Nt) return o;
        }
        return xf(t, n, r, i);
      }
      function Nf(e, t, n, r, i) {
        const o = (function Z_(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Zr) ? e[Zr] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : K_) : t;
        })(n);
        if ("function" == typeof o) {
          if (!yf(t, e, r)) return r & N.Host ? Af(i, 0, r) : xf(t, n, r, i);
          try {
            const s = o(r);
            if (null != s || r & N.Optional) return s;
            ho();
          } finally {
            _f();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = Ka(e, t),
            u = -1,
            l = r & N.Host ? t[16][6] : null;
          for (
            (-1 === a || r & N.SkipSelf) &&
            ((u = -1 === a ? xo(e, t) : t[a + 8]),
            -1 !== u && Ff(r, !1)
              ? ((s = t[1]), (a = or(u)), (t = sr(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[1];
            if (Pf(o, a, c.data)) {
              const d = Q_(a, t, n, s, r, l);
              if (d !== Nt) return d;
            }
            (u = t[a + 8]),
              -1 !== u && Ff(r, t[1].data[a + 8] === l) && Pf(o, a, t)
                ? ((s = c), (a = or(u)), (t = sr(u, t)))
                : (a = -1);
          }
        }
        return i;
      }
      function Q_(e, t, n, r, i, o) {
        const s = t[1],
          a = s.data[e + 8],
          c = (function No(e, t, n, r, i) {
            const o = e.providerIndexes,
              s = t.data,
              a = 1048575 & o,
              u = e.directiveStart,
              c = o >> 20,
              f = i ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (i) {
              const h = s[u];
              if (h && yt(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? wo(a) && Qa : r != s && 0 != (3 & a.type),
            i & N.Host && o === a
          );
        return null !== c ? ii(t, s, c, a) : Nt;
      }
      function ii(e, t, n, r) {
        let i = e[n];
        const o = t.data;
        if (
          (function $_(e) {
            return e instanceof ti;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function Gw(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new S(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function Z(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : L(e);
              })(o[n])
            );
          const a = Ao(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? at(s.injectImpl) : null;
          yf(e, r, N.Default);
          try {
            (i = e[n] = s.factory(void 0, o, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function j_(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = t.type.prototype;
                  if (r) {
                    const s = nf(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  i &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, i),
                    o &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, o),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, o));
                })(n, o[n], t);
          } finally {
            null !== u && at(u), Ao(a), (s.resolving = !1), _f();
          }
        }
        return i;
      }
      function Pf(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function Ff(e, t) {
        return !(e & N.Self || (e & N.Host && t));
      }
      class ar {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return Rf(this._tNode, this._lView, t, r, n);
        }
      }
      function K_() {
        return new ar(_e(), w());
      }
      function Of(e) {
        const t = e[1],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[6] : null;
      }
      const lr = "__parameters__";
      function dr(e, t, n) {
        return un(() => {
          const r = (function Ja(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const i in r) this[i] = r[i];
              }
            };
          })(t);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(lr)
                ? u[lr]
                : Object.defineProperty(u, lr, { value: [] })[lr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (i.prototype = Object.create(n.prototype)),
            (i.prototype.ngMetadataName = e),
            (i.annotationCls = i),
            i
          );
        });
      }
      class O {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = H({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function Wt(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Wt(n, t) : t(n)));
      }
      function Lf(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Po(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      const li = {},
        nu = "__NG_DI_FLAG__",
        Oo = "ngTempTokenPath",
        cC = /\n/gm,
        Bf = "__source";
      let ci;
      function hr(e) {
        const t = ci;
        return (ci = e), t;
      }
      function fC(e, t = N.Default) {
        if (void 0 === ci) throw new S(-203, !1);
        return null === ci
          ? Zd(e, void 0, t)
          : ci.get(e, t & N.Optional ? null : void 0, t);
      }
      function x(e, t = N.Default) {
        return (
          (function e_() {
            return Ma;
          })() || fC
        )(F(e), t);
      }
      function fe(e, t = N.Default) {
        return (
          "number" != typeof t &&
            (t =
              0 |
              (t.optional && 8) |
              (t.host && 1) |
              (t.self && 2) |
              (t.skipSelf && 4)),
          x(e, t)
        );
      }
      function ru(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = F(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new S(900, !1);
            let i,
              o = N.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = hC(a);
              "number" == typeof u
                ? -1 === u
                  ? (i = a.token)
                  : (o |= u)
                : (i = a);
            }
            t.push(x(i, o));
          } else t.push(x(r));
        }
        return t;
      }
      function di(e, t) {
        return (e[nu] = t), (e.prototype[nu] = t), e;
      }
      function hC(e) {
        return e[nu];
      }
      const fi = di(dr("Optional"), 8),
        hi = di(dr("SkipSelf"), 4);
      var Qe = (() => (
        ((Qe = Qe || {})[(Qe.Important = 1)] = "Important"),
        (Qe[(Qe.DashCase = 2)] = "DashCase"),
        Qe
      ))();
      const uu = new Map();
      let RC = 0;
      const cu = "__ngContext__";
      function Oe(e, t) {
        qe(t)
          ? ((e[cu] = t[20]),
            (function PC(e) {
              uu.set(e[20], e);
            })(t))
          : (e[cu] = t);
      }
      function fu(e, t) {
        return undefined(e, t);
      }
      function yi(e) {
        const t = e[3];
        return mt(t) ? t[3] : t;
      }
      function hu(e) {
        return uh(e[13]);
      }
      function pu(e) {
        return uh(e[4]);
      }
      function uh(e) {
        for (; null !== e && !mt(e); ) e = e[4];
        return e;
      }
      function gr(e, t, n, r, i) {
        if (null != r) {
          let o,
            s = !1;
          mt(r) ? (o = r) : qe(r) && ((s = !0), (r = r[0]));
          const a = ge(r);
          0 === e && null !== n
            ? null == i
              ? ph(t, n, a)
              : kn(t, n, a, i || null, !0)
            : 1 === e && null !== n
            ? kn(t, n, a, i || null, !0)
            : 2 === e
            ? (function _u(e, t, n) {
                const r = jo(e, t);
                r &&
                  (function tE(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != o &&
              (function iE(e, t, n, r, i) {
                const o = n[7];
                o !== ge(n) && gr(t, e, r, o, i);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  vi(u[1], u, e, t, r, o);
                }
              })(t, e, o, n, i);
        }
      }
      function mu(e, t, n) {
        return e.createElement(t, n);
      }
      function ch(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          i = t[3];
        512 & t[2] && ((t[2] &= -513), ja(i, -1)), n.splice(r, 1);
      }
      function yu(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const i = r[17];
          null !== i && i !== e && ch(i, r), t > 0 && (e[n - 1][4] = r[4]);
          const o = Po(e, 10 + t);
          !(function qC(e, t) {
            vi(e, t, t[$], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = o[19];
          null !== s && s.detachView(o[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function dh(e, t) {
        if (!(128 & t[2])) {
          const n = t[$];
          n.destroyNode && vi(e, t, n, 3, null, null),
            (function KC(e) {
              let t = e[13];
              if (!t) return vu(e[1], e);
              for (; t; ) {
                let n = null;
                if (qe(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    qe(t) && vu(t[1], t), (t = t[3]);
                  null === t && (t = e), qe(t) && vu(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function vu(e, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function eE(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const i = t[n[r]];
                  if (!(i instanceof ti)) {
                    const o = n[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          u = o[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(i);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function XC(e, t) {
              const n = e.cleanup,
                r = t[7];
              let i = -1;
              if (null !== n)
                for (let o = 0; o < n.length - 1; o += 2)
                  if ("string" == typeof n[o]) {
                    const s = n[o + 1],
                      a = "function" == typeof s ? s(t) : ge(t[s]),
                      u = r[(i = n[o + 2])],
                      l = n[o + 3];
                    "boolean" == typeof l
                      ? a.removeEventListener(n[o], u, l)
                      : l >= 0
                      ? r[(i = l)]()
                      : r[(i = -l)].unsubscribe(),
                      (o += 2);
                  } else {
                    const s = r[(i = n[o + 1])];
                    n[o].call(s);
                  }
              if (null !== r) {
                for (let o = i + 1; o < r.length; o++) (0, r[o])();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && t[$].destroy();
          const n = t[17];
          if (null !== n && mt(t[3])) {
            n !== t[3] && ch(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
          !(function FC(e) {
            uu.delete(e[20]);
          })(t);
        }
      }
      function fh(e, t, n) {
        return (function hh(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const i = e.data[r.directiveStart].encapsulation;
            if (i === xt.None || i === xt.Emulated) return null;
          }
          return tt(r, n);
        })(e, t.parent, n);
      }
      function kn(e, t, n, r, i) {
        e.insertBefore(t, n, r, i);
      }
      function ph(e, t, n) {
        e.appendChild(t, n);
      }
      function gh(e, t, n, r, i) {
        null !== r ? kn(e, t, n, r, i) : ph(e, t, n);
      }
      function jo(e, t) {
        return e.parentNode(t);
      }
      let Iu,
        vh = function yh(e, t, n) {
          return 40 & e.type ? tt(e, n) : null;
        };
      function Vo(e, t, n, r) {
        const i = fh(e, r, t),
          o = t[$],
          a = (function mh(e, t, n) {
            return vh(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != i)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) gh(o, i, n[u], a, !1);
          else gh(o, i, n, a, !1);
      }
      function $o(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return tt(t, e);
          if (4 & n) return wu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return $o(e, r);
            {
              const i = e[t.index];
              return mt(i) ? wu(-1, i) : ge(i);
            }
          }
          if (32 & n) return fu(t, e)() || ge(e[t.index]);
          {
            const r = wh(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : $o(yi(e[16]), r)
              : $o(e, t.next);
          }
        }
        return null;
      }
      function wh(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function wu(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            i = r[1].firstChild;
          if (null !== i) return $o(r, i);
        }
        return t[7];
      }
      function Cu(e, t, n, r, i, o, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Oe(ge(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & u) Cu(e, t, n.child, r, i, o, !1), gr(t, e, i, a, o);
            else if (32 & u) {
              const l = fu(n, r);
              let c;
              for (; (c = l()); ) gr(t, e, i, c, o);
              gr(t, e, i, a, o);
            } else 16 & u ? _h(e, t, r, n, i, o) : gr(t, e, i, a, o);
          n = s ? n.projectionNext : n.next;
        }
      }
      function vi(e, t, n, r, i, o) {
        Cu(n, r, e.firstChild, t, i, o, !1);
      }
      function _h(e, t, n, r, i, o) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) gr(t, e, i, u[l], o);
        else Cu(e, t, u, s[3], i, o, !0);
      }
      function Ch(e, t, n) {
        e.setAttribute(t, "style", n);
      }
      function Eu(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      class Mh {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      const DE =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      var me = (() => (
        ((me = me || {})[(me.NONE = 0)] = "NONE"),
        (me[(me.HTML = 1)] = "HTML"),
        (me[(me.STYLE = 2)] = "STYLE"),
        (me[(me.SCRIPT = 3)] = "SCRIPT"),
        (me[(me.URL = 4)] = "URL"),
        (me[(me.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        me
      ))();
      function _i(e) {
        const t = (function Ci() {
          const e = w();
          return e && e[12];
        })();
        return t
          ? t.sanitize(me.URL, e) || ""
          : (function Di(e, t) {
              const n = (function gE(e) {
                return (e instanceof Mh && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(
                  `Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`
                );
              }
              return n === t;
            })(e, "URL")
          ? (function fn(e) {
              return e instanceof Mh
                ? e.changingThisBreaksApplicationSecurity
                : e;
            })(e)
          : (function Mu(e) {
              return (e = String(e)).match(DE) ? e : "unsafe:" + e;
            })(L(e));
      }
      const Ru = new O("ENVIRONMENT_INITIALIZER"),
        Oh = new O("INJECTOR", -1),
        kh = new O("INJECTOR_DEF_TYPES");
      class Lh {
        get(t, n = li) {
          if (n === li) {
            const r = new Error(`NullInjectorError: No provider for ${ee(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function PE(...e) {
        return { ɵproviders: jh(0, e) };
      }
      function jh(e, ...t) {
        const n = [],
          r = new Set();
        let i;
        return (
          Wt(t, (o) => {
            const s = o;
            Nu(s, n, [], r) && (i || (i = []), i.push(s));
          }),
          void 0 !== i && Vh(i, n),
          n
        );
      }
      function Vh(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: i } = e[n];
          Wt(i, (o) => {
            t.push(o);
          });
        }
      }
      function Nu(e, t, n, r) {
        if (!(e = F(e))) return !1;
        let i = null,
          o = qd(e);
        const s = !o && J(e);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = e;
        } else {
          const u = e.ngModule;
          if (((o = qd(u)), !o)) return !1;
          i = u;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) Nu(l, t, n, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let l;
              r.add(i);
              try {
                Wt(o.imports, (c) => {
                  Nu(c, t, n, r) && (l || (l = []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && Vh(l, t);
            }
            if (!a) {
              const l = Fn(i) || (() => new i());
              t.push(
                { provide: i, useFactory: l, deps: K },
                { provide: kh, useValue: i, multi: !0 },
                { provide: Ru, useValue: () => x(i), multi: !0 }
              );
            }
            const u = o.providers;
            null == u ||
              a ||
              Wt(u, (c) => {
                t.push(c);
              });
          }
        }
        return i !== e && void 0 !== e.providers;
      }
      const FE = X({ provide: String, useValue: X });
      function Pu(e) {
        return null !== e && "object" == typeof e && FE in e;
      }
      function jn(e) {
        return "function" == typeof e;
      }
      const Fu = new O("Set Injector scope."),
        zo = {},
        kE = {};
      let Ou;
      function Go() {
        return void 0 === Ou && (Ou = new Lh()), Ou;
      }
      class hn {}
      class Hh extends hn {
        constructor(t, n, r, i) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Lu(t, (s) => this.processProvider(s)),
            this.records.set(Oh, mr(void 0, this)),
            i.has("environment") && this.records.set(hn, mr(void 0, this));
          const o = this.records.get(Fu);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(kh.multi, K, N.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = hr(this),
            r = at(void 0);
          try {
            return t();
          } finally {
            hr(n), at(r);
          }
        }
        get(t, n = li, r = N.Default) {
          this.assertNotDestroyed();
          const i = hr(this),
            o = at(void 0);
          try {
            if (!(r & N.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function BE(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof O)
                    );
                  })(t) && po(t);
                (a = u && this.injectableDefInScope(u) ? mr(ku(t), zo) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & N.Self ? Go() : this.parent).get(
              t,
              (n = r & N.Optional && n === li ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Oo] = s[Oo] || []).unshift(ee(t)), i)) throw s;
              return (function pC(e, t, n, r) {
                const i = e[Oo];
                throw (
                  (t[Bf] && i.unshift(t[Bf]),
                  (e.message = (function gC(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let i = ee(t);
                    if (Array.isArray(t)) i = t.map(ee).join(" -> ");
                    else if ("object" == typeof t) {
                      let o = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : ee(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(
                      cC,
                      "\n  "
                    )}`;
                  })("\n" + e.message, i, n, r)),
                  (e.ngTokenPath = i),
                  (e[Oo] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            at(o), hr(i);
          }
        }
        resolveInjectorInitializers() {
          const t = hr(this),
            n = at(void 0);
          try {
            const r = this.get(Ru.multi, K, N.Self);
            for (const i of r) i();
          } finally {
            hr(t), at(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(ee(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new S(205, !1);
        }
        processProvider(t) {
          let n = jn((t = F(t))) ? t : F(t && t.provide);
          const r = (function jE(e) {
            return Pu(e)
              ? mr(void 0, e.useValue)
              : mr(
                  (function Uh(e, t, n) {
                    let r;
                    if (jn(e)) {
                      const i = F(e);
                      return Fn(i) || ku(i);
                    }
                    if (Pu(e)) r = () => F(e.useValue);
                    else if (
                      (function Bh(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...ru(e.deps || []));
                    else if (
                      (function $h(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => x(F(e.useExisting));
                    else {
                      const i = F(e && (e.useClass || e.provide));
                      if (
                        !(function VE(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return Fn(i) || ku(i);
                      r = () => new i(...ru(e.deps));
                    }
                    return r;
                  })(e),
                  zo
                );
          })(t);
          if (jn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let i = this.records.get(n);
            i ||
              ((i = mr(void 0, zo, !0)),
              (i.factory = () => ru(i.multi)),
              this.records.set(n, i)),
              (n = t),
              i.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === zo && ((n.value = kE), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function $E(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = F(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function ku(e) {
        const t = po(e),
          n = null !== t ? t.factory : Fn(e);
        if (null !== n) return n;
        if (e instanceof O) throw new S(204, !1);
        if (e instanceof Function)
          return (function LE(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function ui(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new S(204, !1))
              );
            const n = (function Yw(e) {
              const t = e && (e[go] || e[Qd]);
              if (t) {
                const n = (function Jw(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new S(204, !1);
      }
      function mr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function HE(e) {
        return !!e.ɵproviders;
      }
      function Lu(e, t) {
        for (const n of e)
          Array.isArray(n) ? Lu(n, t) : HE(n) ? Lu(n.ɵproviders, t) : t(n);
      }
      class zh {}
      class GE {
        resolveComponentFactory(t) {
          throw (function zE(e) {
            const t = Error(
              `No component factory found for ${ee(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let Ei = (() => {
        class e {}
        return (e.NULL = new GE()), e;
      })();
      function WE() {
        return yr(_e(), w());
      }
      function yr(e, t) {
        return new pn(tt(e, t));
      }
      let pn = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = WE), e;
      })();
      class Wh {}
      let ZE = (() => {
        class e {}
        return (
          (e.ɵprov = H({ token: e, providedIn: "root", factory: () => null })),
          e
        );
      })();
      class qo {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const KE = new qo("14.3.0"),
        ju = {};
      function $u(e) {
        return e.ngOriginalError;
      }
      class vr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && $u(t);
          for (; n && $u(n); ) n = $u(n);
          return n || null;
        }
      }
      function Qt(e) {
        return e instanceof Function ? e() : e;
      }
      function Qh(e, t, n) {
        let r = e.length;
        for (;;) {
          const i = e.indexOf(t, n);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const o = t.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
          }
          n = i + 1;
        }
      }
      const Zh = "ng-template";
      function u0(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let i = e[r++];
          if (n && "class" === i) {
            if (((i = e[r]), -1 !== Qh(i.toLowerCase(), t, 0))) return !0;
          } else if (1 === i) {
            for (; r < e.length && "string" == typeof (i = e[r++]); )
              if (i.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Kh(e) {
        return 4 === e.type && e.value !== Zh;
      }
      function l0(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Zh);
      }
      function c0(e, t, n) {
        let r = 4;
        const i = e.attrs || [],
          o = (function h0(e) {
            for (let t = 0; t < e.length; t++) if (Ef(e[t])) return t;
            return e.length;
          })(i);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !l0(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (vt(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!u0(e.attrs, l, n)) {
                    if (vt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = d0(8 & r ? "class" : u, i, Kh(e), n);
                if (-1 === d) {
                  if (vt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > o ? "" : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Qh(h, l, 0)) || (2 & r && l !== f)) {
                    if (vt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !vt(r) && !vt(u)) return !1;
            if (s && vt(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return vt(r) || s;
      }
      function vt(e) {
        return 0 == (1 & e);
      }
      function d0(e, t, n, r) {
        if (null === t) return -1;
        let i = 0;
        if (r || !n) {
          let o = !1;
          for (; i < t.length; ) {
            const s = t[i];
            if (s === e) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function p0(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function Yh(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (c0(e, t[r], n)) return !0;
        return !1;
      }
      function Jh(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function m0(e) {
        let t = e[0],
          n = 1,
          r = 2,
          i = "",
          o = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !vt(s) && ((t += Jh(o, i)), (i = "")),
              (r = s),
              (o = o || !vt(r));
          n++;
        }
        return "" !== i && (t += Jh(o, i)), t;
      }
      const j = {};
      function Zt(e) {
        Xh(W(), w(), Be() + e, !1);
      }
      function Xh(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const o = e.preOrderCheckHooks;
            null !== o && Io(t, o, n);
          } else {
            const o = e.preOrderHooks;
            null !== o && So(t, o, 0, n);
          }
        cn(n);
      }
      function rp(e, t = null, n = null, r) {
        const i = ip(e, t, n, r);
        return i.resolveInjectorInitializers(), i;
      }
      function ip(e, t = null, n = null, r, i = new Set()) {
        const o = [n || K, PE(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : ee(e))),
          new Hh(o, t || Go(), r || null, i)
        );
      }
      let Dt = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return rp({ name: "" }, r, n, "");
            {
              const i = n.name ?? "";
              return rp({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = li),
          (e.NULL = new Lh()),
          (e.ɵprov = H({ token: e, providedIn: "any", factory: () => x(Oh) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function M(e, t = N.Default) {
        const n = w();
        return null === n ? x(e, t) : Rf(_e(), n, F(e), t);
      }
      function Gu() {
        throw new Error("invalid");
      }
      function _p(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r],
              o = n[r + 1];
            if (-1 !== o) {
              const s = e.data[o];
              Ua(i), s.contentQueries(2, t[o], o);
            }
          }
      }
      function Jo(e, t, n, r, i, o, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[0] = i),
          (d[2] = 76 | r),
          (null !== c || (e && 1024 & e[2])) && (d[2] |= 1024),
          af(d),
          (d[3] = d[15] = e),
          (d[8] = n),
          (d[10] = s || (e && e[10])),
          (d[$] = a || (e && e[$])),
          (d[12] = u || (e && e[12]) || null),
          (d[9] = l || (e && e[9]) || null),
          (d[6] = o),
          (d[20] = (function NC() {
            return RC++;
          })()),
          (d[21] = c),
          (d[16] = 2 == t.type ? e[16] : d),
          d
        );
      }
      function _r(e, t, n, r, i) {
        let o = e.data[t];
        if (null === o)
          (o = (function nl(e, t, n, r, i) {
            const o = ff(),
              s = Va(),
              u = (e.data[t] = (function J0(e, t, n, r, i, o) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: i,
                  attrs: o,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? o : o && o.parent, n, t, r, i));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== o &&
                (s
                  ? null == o.child && null !== u.parent && (o.child = u)
                  : null === o.next && (o.next = u)),
              u
            );
          })(e, t, n, r, i)),
            (function M_() {
              return k.lFrame.inI18n;
            })() && (o.flags |= 64);
        else if (64 & o.type) {
          (o.type = n), (o.value = r), (o.attrs = i);
          const s = (function ei() {
            const e = k.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Rt(o, !0), o;
      }
      function Cr(e, t, n, r) {
        if (0 === n) return -1;
        const i = t.length;
        for (let o = 0; o < n; o++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return i;
      }
      function rl(e, t, n) {
        za(t);
        try {
          const r = e.viewQuery;
          null !== r && dl(1, r, n);
          const i = e.template;
          null !== i && Cp(e, t, i, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && _p(e, t),
            e.staticViewQueries && dl(2, e.viewQuery, n);
          const o = e.components;
          null !== o &&
            (function Z0(e, t) {
              for (let n = 0; n < t.length; n++) pb(e, t[n]);
            })(t, o);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), Ga();
        }
      }
      function Xo(e, t, n, r) {
        const i = t[2];
        if (128 != (128 & i)) {
          za(t);
          try {
            af(t),
              (function pf(e) {
                return (k.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && Cp(e, t, n, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && Io(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && So(t, l, 0, null), Wa(t, 0);
            }
            if (
              ((function fb(e) {
                for (let t = hu(e); null !== t; t = pu(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const i = n[r],
                      o = i[3];
                    0 == (512 & i[2]) && ja(o, 1), (i[2] |= 512);
                  }
                }
              })(t),
              (function db(e) {
                for (let t = hu(e); null !== t; t = pu(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      i = r[1];
                    Eo(r) && Xo(i, r, i.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && _p(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && Io(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && So(t, l, 1), Wa(t, 1);
            }
            !(function q0(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const i = n[r];
                    if (i < 0) cn(~i);
                    else {
                      const o = i,
                        s = n[++r],
                        a = n[++r];
                      T_(s, o), a(2, t[o]);
                    }
                  }
                } finally {
                  cn(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function Q0(e, t) {
                for (let n = 0; n < t.length; n++) hb(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && dl(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && Io(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && So(t, l, 2), Wa(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), ja(t[3], -1));
          } finally {
            Ga();
          }
        }
      }
      function Cp(e, t, n, r, i) {
        const o = Be(),
          s = 2 & r;
        try {
          cn(-1), s && t.length > 22 && Xh(e, t, 22, !1), n(r, i);
        } finally {
          cn(o);
        }
      }
      function il(e, t, n) {
        !lf() ||
          ((function rb(e, t, n, r) {
            const i = n.directiveStart,
              o = n.directiveEnd;
            e.firstCreatePass || ri(n, t), Oe(r, t);
            const s = n.initialInputs;
            for (let a = i; a < o; a++) {
              const u = e.data[a],
                l = yt(u);
              l && ub(t, n, u);
              const c = ii(t, e, a, n);
              Oe(c, t),
                null !== s && lb(0, a - i, c, u, 0, s),
                l && (nt(n.index, t)[8] = c);
            }
          })(e, t, n, tt(n, t)),
          128 == (128 & n.flags) &&
            (function ib(e, t, n) {
              const r = n.directiveStart,
                i = n.directiveEnd,
                o = n.index,
                s = (function A_() {
                  return k.lFrame.currentDirectiveIndex;
                })();
              try {
                cn(o);
                for (let a = r; a < i; a++) {
                  const u = e.data[a],
                    l = t[a];
                  Ba(a),
                    (null !== u.hostBindings ||
                      0 !== u.hostVars ||
                      null !== u.hostAttrs) &&
                      xp(u, l);
                }
              } finally {
                cn(-1), Ba(s);
              }
            })(e, t, n));
      }
      function ol(e, t, n = tt) {
        const r = t.localNames;
        if (null !== r) {
          let i = t.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[i++] = a;
          }
        }
      }
      function bp(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = sl(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function sl(e, t, n, r, i, o, s, a, u, l) {
        const c = 22 + r,
          d = c + i,
          f = (function K0(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : j);
            return n;
          })(c, d),
          h = "function" == typeof l ? l() : l;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Sp(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const i = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(t, i)
              : (n[r] = [t, i]);
          }
        return n;
      }
      function Mp(e, t) {
        const r = t.directiveEnd,
          i = e.data,
          o = t.attrs,
          s = [];
        let a = null,
          u = null;
        for (let l = t.directiveStart; l < r; l++) {
          const c = i[l],
            d = c.inputs,
            f = null === o || Kh(t) ? null : cb(d, o);
          s.push(f), (a = Sp(d, l, a)), (u = Sp(c.outputs, l, u));
        }
        null !== a &&
          (a.hasOwnProperty("class") && (t.flags |= 16),
          a.hasOwnProperty("style") && (t.flags |= 32)),
          (t.initialInputs = s),
          (t.inputs = a),
          (t.outputs = u);
      }
      function Tp(e, t) {
        const n = nt(t, e);
        16 & n[2] || (n[2] |= 32);
      }
      function al(e, t, n, r) {
        let i = !1;
        if (lf()) {
          const o = (function ob(e, t, n) {
              const r = e.directiveRegistry;
              let i = null;
              if (r)
                for (let o = 0; o < r.length; o++) {
                  const s = r[o];
                  Yh(n, s.selectors, !1) &&
                    (i || (i = []),
                    Ro(ri(n, t), e, s.type),
                    yt(s) ? (Rp(e, n), i.unshift(s)) : i.push(s));
                }
              return i;
            })(e, t, n),
            s = null === r ? null : { "": -1 };
          if (null !== o) {
            (i = !0), Np(n, e.data.length, o.length);
            for (let c = 0; c < o.length; c++) {
              const d = o[c];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              u = !1,
              l = Cr(e, t, o.length, null);
            for (let c = 0; c < o.length; c++) {
              const d = o[c];
              (n.mergedAttrs = To(n.mergedAttrs, d.hostAttrs)),
                Pp(e, n, t, l, d),
                ab(l, d, s),
                null !== d.contentQueries && (n.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (n.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
                (a = !0)),
                !u &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                    n.index
                  ),
                  (u = !0)),
                l++;
            }
            Mp(e, n);
          }
          s &&
            (function sb(e, t, n) {
              if (t) {
                const r = (e.localNames = []);
                for (let i = 0; i < t.length; i += 2) {
                  const o = n[t[i + 1]];
                  if (null == o) throw new S(-301, !1);
                  r.push(t[i], o);
                }
              }
            })(n, r, s);
        }
        return (n.mergedAttrs = To(n.mergedAttrs, n.attrs)), i;
      }
      function Ap(e, t, n, r, i, o) {
        const s = o.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const u = ~t.index;
          (function nb(e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != u && a.push(u),
            a.push(r, i, s);
        }
      }
      function xp(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Rp(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function ab(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          yt(t) && (n[""] = e);
        }
      }
      function Np(e, t, n) {
        (e.flags |= 1),
          (e.directiveStart = t),
          (e.directiveEnd = t + n),
          (e.providerIndexes = t);
      }
      function Pp(e, t, n, r, i) {
        e.data[r] = i;
        const o = i.factory || (i.factory = Fn(i.type)),
          s = new ti(o, yt(i), M);
        (e.blueprint[r] = s),
          (n[r] = s),
          Ap(e, t, 0, r, Cr(e, n, i.hostVars, j), i);
      }
      function ub(e, t, n) {
        const r = tt(t, e),
          i = bp(n),
          o = e[10],
          s = es(
            e,
            Jo(
              e,
              i,
              null,
              n.onPush ? 32 : 16,
              r,
              t,
              o,
              o.createRenderer(r, n),
              null,
              null,
              null
            )
          );
        e[t.index] = s;
      }
      function lb(e, t, n, r, i, o) {
        const s = o[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const l = s[u++],
              c = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
          }
        }
      }
      function cb(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const i = t[r];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              e.hasOwnProperty(i) &&
                (null === n && (n = []), n.push(i, e[i], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function Fp(e, t, n, r) {
        return new Array(e, !0, !1, t, null, 0, r, n, null, null);
      }
      function hb(e, t) {
        const n = nt(t, e);
        if (Eo(n)) {
          const r = n[1];
          48 & n[2] ? Xo(r, n, r.template, n[8]) : n[5] > 0 && ll(n);
        }
      }
      function ll(e) {
        for (let r = hu(e); null !== r; r = pu(r))
          for (let i = 10; i < r.length; i++) {
            const o = r[i];
            if (Eo(o))
              if (512 & o[2]) {
                const s = o[1];
                Xo(s, o, s.template, o[8]);
              } else o[5] > 0 && ll(o);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const i = nt(n[r], e);
            Eo(i) && i[5] > 0 && ll(i);
          }
      }
      function pb(e, t) {
        const n = nt(t, e),
          r = n[1];
        (function gb(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          rl(r, n, n[8]);
      }
      function es(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function cl(e) {
        for (; e; ) {
          e[2] |= 32;
          const t = yi(e);
          if (a_(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function ts(e, t, n, r = !0) {
        const i = t[10];
        i.begin && i.begin();
        try {
          Xo(e, t, e.template, n);
        } catch (s) {
          throw (r && jp(t, s), s);
        } finally {
          i.end && i.end();
        }
      }
      function dl(e, t, n) {
        Ua(0), t(e, n);
      }
      function Op(e) {
        return e[7] || (e[7] = []);
      }
      function kp(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function jp(e, t) {
        const n = e[9],
          r = n ? n.get(vr, null) : null;
        r && r.handleError(t);
      }
      function fl(e, t, n, r, i) {
        for (let o = 0; o < n.length; ) {
          const s = n[o++],
            a = n[o++],
            u = t[s],
            l = e.data[s];
          null !== l.setInput ? l.setInput(u, i, r, a) : (u[a] = i);
        }
      }
      function Yt(e, t, n) {
        const r = (function Co(e, t) {
          return ge(t[e]);
        })(t, e);
        !(function lh(e, t, n) {
          e.setValue(t, n);
        })(e[$], r, n);
      }
      function ns(e, t, n) {
        let r = n ? e.styles : null,
          i = n ? e.classes : null,
          o = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = Ea(i, a))
              : 2 == o && (r = Ea(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      function rs(e, t, n, r, i = !1) {
        for (; null !== n; ) {
          const o = t[n.index];
          if ((null !== o && r.push(ge(o)), mt(o)))
            for (let a = 10; a < o.length; a++) {
              const u = o[a],
                l = u[1].firstChild;
              null !== l && rs(u[1], u, l, r);
            }
          const s = n.type;
          if (8 & s) rs(e, t, n.child, r);
          else if (32 & s) {
            const a = fu(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = wh(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = yi(t[16]);
              rs(u[1], u, a, r, !0);
            }
          }
          n = i ? n.projectionNext : n.next;
        }
        return r;
      }
      class bi {
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return rs(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (mt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (yu(t, r), Po(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          dh(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function Ip(e, t, n, r) {
            const i = Op(t);
            null === n
              ? i.push(r)
              : (i.push(n), e.firstCreatePass && kp(e).push(r, i.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          cl(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          ts(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new S(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function ZC(e, t) {
              vi(e, t, t[$], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new S(902, !1);
          this._appRef = t;
        }
      }
      class mb extends bi {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          ts(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class hl extends Ei {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = J(t);
          return new Ii(n, this.ngModule);
        }
      }
      function Vp(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class vb {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          const i = this.injector.get(t, ju, r);
          return i !== ju || n === ju ? i : this.parentInjector.get(t, n, r);
        }
      }
      class Ii extends zh {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function y0(e) {
              return e.map(m0).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return Vp(this.componentDef.inputs);
        }
        get outputs() {
          return Vp(this.componentDef.outputs);
        }
        create(t, n, r, i) {
          let o = (i = i || this.ngModule) instanceof hn ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new vb(t, o) : t,
            a = s.get(Wh, null);
          if (null === a) throw new S(407, !1);
          const u = s.get(ZE, null),
            l = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function Y0(e, t, n) {
                  return e.selectRootElement(t, n === xt.ShadowDom);
                })(l, r, this.componentDef.encapsulation)
              : mu(
                  l,
                  c,
                  (function yb(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = sl(0, null, null, 1, 0, null, null, null, null, null),
            p = Jo(null, h, null, f, null, null, a, l, u, s, null);
          let g, m;
          za(p);
          try {
            const C = (function _b(e, t, n, r, i, o) {
              const s = n[1];
              n[22] = e;
              const u = _r(s, 22, 2, "#host", null),
                l = (u.mergedAttrs = t.hostAttrs);
              null !== l &&
                (ns(u, l, !0),
                null !== e &&
                  (Mo(i, e, l),
                  null !== u.classes && Eu(i, e, u.classes),
                  null !== u.styles && Ch(i, e, u.styles)));
              const c = r.createRenderer(e, t),
                d = Jo(
                  n,
                  bp(t),
                  null,
                  t.onPush ? 32 : 16,
                  n[22],
                  u,
                  r,
                  c,
                  o || null,
                  null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (Ro(ri(u, n), s, t.type), Rp(s, u), Np(u, n.length, 1)),
                es(n, d),
                (n[22] = d)
              );
            })(d, this.componentDef, p, a, l);
            if (d)
              if (r) Mo(l, d, ["ng-version", KE.full]);
              else {
                const { attrs: E, classes: y } = (function v0(e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    i = 2;
                  for (; r < e.length; ) {
                    let o = e[r];
                    if ("string" == typeof o)
                      2 === i
                        ? "" !== o && t.push(o, e[++r])
                        : 8 === i && n.push(o);
                    else {
                      if (!vt(i)) break;
                      i = o;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                E && Mo(l, d, E), y && y.length > 0 && Eu(l, d, y.join(" "));
              }
            if (((m = La(h, 22)), void 0 !== n)) {
              const E = (m.projection = []);
              for (let y = 0; y < this.ngContentSelectors.length; y++) {
                const T = n[y];
                E.push(null != T ? Array.from(T) : null);
              }
            }
            (g = (function Cb(e, t, n, r) {
              const i = n[1],
                o = (function tb(e, t, n) {
                  const r = _e();
                  e.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    Pp(e, r, t, Cr(e, t, 1, null), n),
                    Mp(e, r));
                  const i = ii(t, e, r.directiveStart, r);
                  Oe(i, t);
                  const o = tt(r, t);
                  return o && Oe(o, t), i;
                })(i, n, t);
              if (((e[8] = n[8] = o), null !== r)) for (const a of r) a(o, t);
              if (t.contentQueries) {
                const a = _e();
                t.contentQueries(1, o, a.directiveStart);
              }
              const s = _e();
              return (
                !i.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (cn(s.index),
                  Ap(n[1], s, 0, s.directiveStart, s.directiveEnd, t),
                  xp(t, o)),
                o
              );
            })(C, this.componentDef, p, [Eb])),
              rl(h, p, null);
          } finally {
            Ga();
          }
          return new wb(this.componentType, g, yr(m, p), p, m);
        }
      }
      class wb extends class UE {} {
        constructor(t, n, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new mb(i)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[t])) {
            const o = this._rootLView;
            fl(o[1], o, i, t, n), Tp(o, this._tNode.index);
          }
        }
        get injector() {
          return new ar(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function Eb() {
        const e = _e();
        bo(w()[1], e);
      }
      let is = null;
      function Vn() {
        if (!is) {
          const e = ne.Symbol;
          if (e && e.iterator) is = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (is = r);
            }
          }
        }
        return is;
      }
      function Si(e) {
        return (
          !!(function gl(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Vn() in e))
        );
      }
      function ke(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function ss(e, t, n, r, i, o, s, a) {
        const u = w(),
          l = W(),
          c = e + 22,
          d = l.firstCreatePass
            ? (function Ob(e, t, n, r, i, o, s, a, u) {
                const l = t.consts,
                  c = _r(t, e, 4, s || null, ln(l, a));
                al(t, n, c, ln(l, u)), bo(t, c);
                const d = (c.tViews = sl(
                  2,
                  c,
                  r,
                  i,
                  o,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  l
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, l, u, t, n, r, i, o, s)
            : l.data[c];
        Rt(d, !1);
        const f = u[$].createComment("");
        Vo(l, u, f, d),
          Oe(f, u),
          es(u, (u[c] = Fp(f, u, f, d))),
          _o(d) && il(l, u, d),
          null != s && ol(u, d, a);
      }
      function Bn(e, t, n) {
        const r = w();
        return (
          ke(r, ir(), t) &&
            (function ot(e, t, n, r, i, o, s, a) {
              const u = tt(t, n);
              let c,
                l = t.inputs;
              !a && null != l && (c = l[r])
                ? (fl(e, n, c, r, i), wo(t) && Tp(n, t.index))
                : 3 & t.type &&
                  ((r = (function X0(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (i = null != s ? s(i, t.value || "", r) : i),
                  o.setProperty(u, r, i));
            })(
              W(),
              (function ue() {
                const e = k.lFrame;
                return La(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              t,
              r[$],
              n,
              !1
            ),
          Bn
        );
      }
      function yl(e, t, n, r, i) {
        const s = i ? "class" : "style";
        fl(e, n, t.inputs[s], s, r);
      }
      function v(e, t, n, r) {
        const i = w(),
          o = W(),
          s = 22 + e,
          a = i[$],
          u = (i[s] = mu(
            a,
            t,
            (function L_() {
              return k.lFrame.currentNamespace;
            })()
          )),
          l = o.firstCreatePass
            ? (function jb(e, t, n, r, i, o, s) {
                const a = t.consts,
                  l = _r(t, e, 2, i, ln(a, o));
                return (
                  al(t, n, l, ln(a, s)),
                  null !== l.attrs && ns(l, l.attrs, !1),
                  null !== l.mergedAttrs && ns(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, o, i, 0, t, n, r)
            : o.data[s];
        Rt(l, !0);
        const c = l.mergedAttrs;
        null !== c && Mo(a, u, c);
        const d = l.classes;
        null !== d && Eu(a, u, d);
        const f = l.styles;
        return (
          null !== f && Ch(a, u, f),
          64 != (64 & l.flags) && Vo(o, i, u, l),
          0 ===
            (function __() {
              return k.lFrame.elementDepthCount;
            })() && Oe(u, i),
          (function C_() {
            k.lFrame.elementDepthCount++;
          })(),
          _o(l) &&
            (il(o, i, l),
            (function Ep(e, t, n) {
              if (Na(t)) {
                const i = t.directiveEnd;
                for (let o = t.directiveStart; o < i; o++) {
                  const s = e.data[o];
                  s.contentQueries && s.contentQueries(1, n[o], o);
                }
              }
            })(o, l, i)),
          null !== r && ol(i, l),
          v
        );
      }
      function D() {
        let e = _e();
        Va()
          ? (function $a() {
              k.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Rt(e, !1));
        const t = e;
        !(function E_() {
          k.lFrame.elementDepthCount--;
        })();
        const n = W();
        return (
          n.firstCreatePass && (bo(n, e), Na(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function H_(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            yl(n, t, w(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function U_(e) {
              return 0 != (32 & e.flags);
            })(t) &&
            yl(n, t, w(), t.stylesWithoutHost, !1),
          D
        );
      }
      function se(e, t, n, r) {
        return v(e, t, n, r), D(), se;
      }
      function as(e) {
        return !!e && "function" == typeof e.then;
      }
      const eg = function Xp(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function Ti(e, t, n, r) {
        const i = w(),
          o = W(),
          s = _e();
        return (
          (function ng(e, t, n, r, i, o, s, a) {
            const u = _o(r),
              c = e.firstCreatePass && kp(e),
              d = t[8],
              f = Op(t);
            let h = !0;
            if (3 & r.type || a) {
              const m = tt(r, t),
                C = a ? a(m) : m,
                E = f.length,
                y = a ? (q) => a(ge(q[r.index])) : r.index;
              let T = null;
              if (
                (!a &&
                  u &&
                  (T = (function $b(e, t, n, r) {
                    const i = e.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === n && i[o + 1] === r) {
                          const a = t[7],
                            u = i[o + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (o += 2);
                      }
                    return null;
                  })(e, t, i, r.index)),
                null !== T)
              )
                ((T.__ngLastListenerFn__ || T).__ngNextListenerFn__ = o),
                  (T.__ngLastListenerFn__ = o),
                  (h = !1);
              else {
                o = ig(r, t, d, o, !1);
                const q = n.listen(C, i, o);
                f.push(o, q), c && c.push(i, y, E, E + 1);
              }
            } else o = ig(r, t, d, o, !1);
            const p = r.outputs;
            let g;
            if (h && null !== p && (g = p[i])) {
              const m = g.length;
              if (m)
                for (let C = 0; C < m; C += 2) {
                  const ae = t[g[C]][g[C + 1]].subscribe(o),
                    Kn = f.length;
                  f.push(o, ae), c && c.push(i, r.index, Kn, -(Kn + 1));
                }
            }
          })(o, i, i[$], s, e, t, 0, r),
          Ti
        );
      }
      function rg(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (i) {
          return jp(e, i), !1;
        }
      }
      function ig(e, t, n, r, i) {
        return function o(s) {
          if (s === Function) return r;
          cl(2 & e.flags ? nt(e.index, t) : t);
          let u = rg(t, 0, r, s),
            l = o.__ngNextListenerFn__;
          for (; l; ) (u = rg(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
          return i && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function og(e = 1) {
        return (function R_(e) {
          return (k.lFrame.contextLView = (function N_(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, k.lFrame.contextLView))[8];
        })(e);
      }
      function _(e, t = "") {
        const n = w(),
          r = W(),
          i = e + 22,
          o = r.firstCreatePass ? _r(r, i, 1, t, null) : r.data[i],
          s = (n[i] = (function gu(e, t) {
            return e.createText(t);
          })(n[$], t));
        Vo(r, n, s, o), Rt(o, !1);
      }
      function xi(e) {
        return ls("", e, ""), xi;
      }
      function ls(e, t, n) {
        const r = w(),
          i = (function br(e, t, n, r) {
            return ke(e, ir(), n) ? t + L(n) + r : j;
          })(r, e, t, n);
        return i !== j && Yt(r, Be(), i), ls;
      }
      const Fr = "en-US";
      let Yg = Fr;
      class Un {}
      class Em {}
      class bm extends Un {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new hl(this));
          const r = Xe(t);
          (this._bootstrapComponents = Qt(r.bootstrap)),
            (this._r3Injector = ip(
              t,
              n,
              [
                { provide: Un, useValue: this },
                { provide: Ei, useValue: this.componentFactoryResolver },
              ],
              ee(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class Tl extends Em {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new bm(this.moduleType, t);
        }
      }
      class TS extends Un {
        constructor(t, n, r) {
          super(),
            (this.componentFactoryResolver = new hl(this)),
            (this.instance = null);
          const i = new Hh(
            [
              ...t,
              { provide: Un, useValue: this },
              { provide: Ei, useValue: this.componentFactoryResolver },
            ],
            n || Go(),
            r,
            new Set(["environment"])
          );
          (this.injector = i), i.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function ps(e, t, n = null) {
        return new TS(e, t, n).injector;
      }
      let AS = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = jh(0, n.type),
                i =
                  r.length > 0
                    ? ps([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, i);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = H({
            token: e,
            providedIn: "environment",
            factory: () => new e(x(hn)),
          })),
          e
        );
      })();
      function Im(e) {
        e.getStandaloneInjector = (t) =>
          t.get(AS).getOrCreateStandaloneInjector(e);
      }
      function xl(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const ze = class tM extends Tt {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let i = t,
            o = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (i = u.next?.bind(u)),
              (o = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((o = xl(o)), i && (i = xl(i)), s && (s = xl(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return t instanceof st && t.add(a), a;
        }
      };
      let Jt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = oM), e;
      })();
      const rM = Jt,
        iM = class extends rM {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tViews,
              i = Jo(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                n || null
              );
            i[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return (
              null !== s && (i[19] = s.createEmbeddedView(r)),
              rl(r, i, t),
              new bi(i)
            );
          }
        };
      function oM() {
        return (function gs(e, t) {
          return 4 & e.type ? new iM(t, e, yr(e, t)) : null;
        })(_e(), w());
      }
      let Et = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = sM), e;
      })();
      function sM() {
        return (function Vm(e, t) {
          let n;
          const r = t[e.index];
          if (mt(r)) n = r;
          else {
            let i;
            if (8 & e.type) i = ge(r);
            else {
              const o = t[$];
              i = o.createComment("");
              const s = tt(e, t);
              kn(
                o,
                jo(o, s),
                i,
                (function nE(e, t) {
                  return e.nextSibling(t);
                })(o, s),
                !1
              );
            }
            (t[e.index] = n = Fp(r, t, i, e)), es(t, n);
          }
          return new Lm(n, e, t);
        })(_e(), w());
      }
      const aM = Et,
        Lm = class extends aM {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return yr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new ar(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = xo(this._hostTNode, this._hostLView);
            if (Sf(t)) {
              const n = sr(t, this._hostLView),
                r = or(t);
              return new ar(n[1].data[r + 8], n);
            }
            return new ar(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = jm(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            let i, o;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (o = r.injector));
            const s = t.createEmbeddedView(n || {}, o);
            return this.insert(s, i), s;
          }
          createComponent(t, n, r, i, o) {
            const s =
              t &&
              !(function ai(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (i = d.projectableNodes),
                (o = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new Ii(J(t)),
              l = r || this.parentInjector;
            if (!o && null == u.ngModule) {
              const f = (s ? l : this.parentInjector).get(hn, null);
              f && (o = f);
            }
            const c = u.create(l, i, void 0, o);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              i = r[1];
            if (
              (function w_(e) {
                return mt(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new Lm(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const o = this._adjustIndex(n),
              s = this._lContainer;
            !(function YC(e, t, n, r) {
              const i = 10 + r,
                o = n.length;
              r > 0 && (n[i - 1][4] = t),
                r < o - 10
                  ? ((t[4] = n[i]), Lf(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function JC(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 64);
            })(i, r, s, o);
            const a = wu(o, s),
              u = r[$],
              l = jo(u, s[7]);
            return (
              null !== l &&
                (function QC(e, t, n, r, i, o) {
                  (r[0] = i), (r[6] = t), vi(e, r, n, 1, i, o);
                })(i, s[6], u, r, l, a),
              t.attachToViewContainerRef(),
              Lf(Nl(s), o, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = jm(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = yu(this._lContainer, n);
            r && (Po(Nl(this._lContainer), n), dh(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = yu(this._lContainer, n);
            return r && null != Po(Nl(this._lContainer), n) ? new bi(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function jm(e) {
        return e[8];
      }
      function Nl(e) {
        return e[8] || (e[8] = []);
      }
      function ys(...e) {}
      const vs = new O("Application Initializer");
      let Ds = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = ys),
              (this.reject = ys),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const o = this.appInits[i]();
                if (as(o)) n.push(o);
                else if (eg(o)) {
                  const s = new Promise((a, u) => {
                    o.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(vs, 8));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Vi = new O("AppId", {
        providedIn: "root",
        factory: function ly() {
          return `${Gl()}${Gl()}${Gl()}`;
        },
      });
      function Gl() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const cy = new O("Platform Initializer"),
        dy = new O("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        fy = new O("appBootstrapListener");
      let LM = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      const Xt = new O("LocaleId", {
        providedIn: "root",
        factory: () =>
          fe(Xt, N.Optional | N.SkipSelf) ||
          (function jM() {
            return (typeof $localize < "u" && $localize.locale) || Fr;
          })(),
      });
      class $M {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Wl = (() => {
        class e {
          compileModuleSync(n) {
            return new Tl(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              o = Qt(Xe(n).declarations).reduce((s, a) => {
                const u = J(a);
                return u && s.push(new Ii(u)), s;
              }, []);
            return new $M(r, o);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const UM = (() => Promise.resolve(0))();
      function ql(e) {
        typeof Zone > "u"
          ? UM.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class be {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ze(!1)),
            (this.onMicrotaskEmpty = new ze(!1)),
            (this.onStable = new ze(!1)),
            (this.onError = new ze(!1)),
            typeof Zone > "u")
          )
            throw new S(908, !1);
          Zone.assertZonePatched();
          const i = this;
          if (
            ((i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.AsyncStackTaggingZoneSpec)
          ) {
            const o = Zone.AsyncStackTaggingZoneSpec;
            i._inner = i._inner.fork(new o("Angular"));
          }
          Zone.TaskTrackingZoneSpec &&
            (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && n),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function zM() {
              let e = ne.requestAnimationFrame,
                t = ne.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function qM(e) {
              const t = () => {
                !(function WM(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(ne, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Zl(e),
                                (e.isCheckStableRunning = !0),
                                Ql(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Zl(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, i, o, s, a) => {
                  try {
                    return gy(e), n.invokeTask(i, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      my(e);
                  }
                },
                onInvoke: (n, r, i, o, s, a, u) => {
                  try {
                    return gy(e), n.invoke(i, o, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), my(e);
                  }
                },
                onHasTask: (n, r, i, o) => {
                  n.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask),
                          Zl(e),
                          Ql(e))
                        : "macroTask" == o.change &&
                          (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (n, r, i, o) => (
                  n.handleError(i, o),
                  e.runOutsideAngular(() => e.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!be.isInAngularZone()) throw new S(909, !1);
        }
        static assertNotInAngularZone() {
          if (be.isInAngularZone()) throw new S(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, t, GM, ys, ys);
          try {
            return o.runTask(s, n, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const GM = {};
      function Ql(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Zl(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function gy(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function my(e) {
        e._nesting--, Ql(e);
      }
      class QM {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ze()),
            (this.onMicrotaskEmpty = new ze()),
            (this.onStable = new ze()),
            (this.onError = new ze());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, i) {
          return t.apply(n, r);
        }
      }
      const yy = new O(""),
        ws = new O("");
      let Jl,
        Kl = (() => {
          class e {
            constructor(n, r, i) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Jl ||
                  ((function ZM(e) {
                    Jl = e;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      be.assertNotInAngularZone(),
                        ql(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                ql(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: o, updateCb: i });
            }
            whenStable(n, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, i) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(be), x(Yl), x(ws));
            }),
            (e.ɵprov = H({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Yl = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Jl?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = H({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        yn = null;
      const vy = new O("AllowMultipleToken"),
        Xl = new O("PlatformDestroyListeners");
      class Dy {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function _y(e, t, n = []) {
        const r = `Platform: ${t}`,
          i = new O(r);
        return (o = []) => {
          let s = ec();
          if (!s || s.injector.get(vy, !1)) {
            const a = [...n, ...o, { provide: i, useValue: !0 }];
            e
              ? e(a)
              : (function JM(e) {
                  if (yn && !yn.get(vy, !1)) throw new S(400, !1);
                  yn = e;
                  const t = e.get(Ey);
                  (function wy(e) {
                    const t = e.get(cy, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function Cy(e = [], t) {
                    return Dt.create({
                      name: t,
                      providers: [
                        { provide: Fu, useValue: "platform" },
                        { provide: Xl, useValue: new Set([() => (yn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function eT(e) {
            const t = ec();
            if (!t) throw new S(401, !1);
            return t;
          })();
        };
      }
      function ec() {
        return yn?.get(Ey) ?? null;
      }
      let Ey = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const i = (function Iy(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new QM()
                      : ("zone.js" === e ? void 0 : e) || new be(t)),
                  n
                );
              })(
                r?.ngZone,
                (function by(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              o = [{ provide: be, useValue: i }];
            return i.run(() => {
              const s = Dt.create({
                  providers: o,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                u = a.injector.get(vr, null);
              if (!u) throw new S(402, !1);
              return (
                i.runOutsideAngular(() => {
                  const l = i.onError.subscribe({
                    next: (c) => {
                      u.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    Cs(this._modules, a), l.unsubscribe();
                  });
                }),
                (function Sy(e, t, n) {
                  try {
                    const r = n();
                    return as(r)
                      ? r.catch((i) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, i, () => {
                  const l = a.injector.get(Ds);
                  return (
                    l.runInitializers(),
                    l.donePromise.then(
                      () => (
                        (function Jg(e) {
                          Je(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Yg = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(Xt, Fr) || Fr),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const i = My({}, r);
            return (function KM(e, t, n) {
              const r = new Tl(n);
              return Promise.resolve(r);
            })(0, 0, n).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(_s);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!n.instance.ngDoBootstrap) throw new S(403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new S(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Xl, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Dt));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function My(e, t) {
        return Array.isArray(t) ? t.reduce(My, e) : { ...e, ...t };
      }
      let _s = (() => {
        class e {
          constructor(n, r, i) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const o = new De((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new De((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    be.assertNotInAngularZone(),
                      ql(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const l = this._zone.onUnstable.subscribe(() => {
                  be.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), l.unsubscribe();
                };
              });
            this.isStable = (function Hw(...e) {
              const t = Qr(e),
                n = (function Ow(e, t) {
                  return "number" == typeof wa(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? At(r[0])
                  : Yn(n)(we(r, t))
                : $t;
            })(
              o,
              s.pipe(
                (function Uw(e = {}) {
                  const {
                    connector: t = () => new Tt(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: i = !0,
                  } = e;
                  return (o) => {
                    let s,
                      a,
                      u,
                      l = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return Me((g, m) => {
                      l++, !d && !c && f();
                      const C = (u = u ?? t());
                      m.add(() => {
                        l--, 0 === l && !d && !c && (a = _a(p, i));
                      }),
                        C.subscribe(m),
                        !s &&
                          l > 0 &&
                          ((s = new qr({
                            next: (E) => C.next(E),
                            error: (E) => {
                              (d = !0), f(), (a = _a(h, n, E)), C.error(E);
                            },
                            complete: () => {
                              (c = !0), f(), (a = _a(h, r)), C.complete();
                            },
                          })),
                          At(g).subscribe(s));
                    })(o);
                  };
                })()
              )
            );
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const i = n instanceof zh;
            if (!this._injector.get(Ds).done)
              throw (
                (!i &&
                  (function Xn(e) {
                    const t = J(e) || je(e) || Ve(e);
                    return null !== t && t.standalone;
                  })(n),
                new S(405, false))
              );
            let s;
            (s = i ? n : this._injector.get(Ei).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function YM(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Un),
              l = s.create(Dt.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(yy, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  Cs(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new S(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Cs(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(fy, [])
                .concat(this._bootstrapListeners)
                .forEach((i) => i(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Cs(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new S(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(be), x(hn), x(vr));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Cs(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Ay = !0,
        tc = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = rT), e;
        })();
      function rT(e) {
        return (function iT(e, t, n) {
          if (wo(e) && !n) {
            const r = nt(e.index, t);
            return new bi(r, r);
          }
          return 47 & e.type ? new bi(t[16], t) : null;
        })(_e(), w(), 16 == (16 & e));
      }
      class Fy {
        constructor() {}
        supports(t) {
          return Si(t);
        }
        create(t) {
          return new cT(t);
        }
      }
      const lT = (e, t) => t;
      class cT {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || lT);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < ky(r, i, o)) ? n : r,
              a = ky(s, i, o),
              u = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const l = a - i,
                c = u - i;
              if (l != c) {
                for (let f = 0; f < l; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    p = h + f;
                  c <= p && p < l && (o[f] = h + 1);
                }
                o[s.previousIndex] = c - l;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Si(t))) throw new S(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let i,
            o,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (o = t[a]),
                (s = this._trackByFn(a, o)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, o, s, a)),
                    Object.is(n.item, o) || this._addIdentityChange(n, o))
                  : ((n = this._mismatch(n, o, s, a)), (r = !0)),
                (n = n._next);
          } else
            (i = 0),
              (function Nb(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Vn()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, i)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, i)), (r = !0)),
                  (n = n._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, i) {
          let o;
          return (
            null === t ? (o = this._itTail) : ((o = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, o, i))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, i))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, o, i))
              : (t = this._addAfter(new dT(n, r), o, i)),
            t
          );
        }
        _verifyReinsertion(t, n, r, i) {
          let o =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (t = this._reinsertAfter(o, t._prev, i))
              : t.currentIndex != i &&
                ((t.currentIndex = i), this._addToMoves(t, i)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const i = t._prevRemoved,
            o = t._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const i = null === n ? this._itHead : n._next;
          return (
            (t._next = i),
            (t._prev = n),
            null === i ? (this._itTail = t) : (i._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Oy()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Oy()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class dT {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class fT {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Oy {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new fT()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const i = this.map.get(t);
          return i ? i.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function ky(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let i = 0;
        return n && r < n.length && (i = n[r]), r + t + i;
      }
      function jy() {
        return new Is([new Fy()]);
      }
      let Is = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || jy()),
              deps: [[e, new hi(), new fi()]],
            };
          }
          find(n) {
            const r = this.factories.find((i) => i.supports(n));
            if (null != r) return r;
            throw new S(901, !1);
          }
        }
        return (e.ɵprov = H({ token: e, providedIn: "root", factory: jy })), e;
      })();
      const yT = _y(null, "core", []);
      let vT = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(_s));
            }),
            (e.ɵmod = An({ type: e })),
            (e.ɵinj = an({})),
            e
          );
        })(),
        Ss = null;
      function vn() {
        return Ss;
      }
      const Ze = new O("DocumentToken");
      let sc = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({
            token: e,
            factory: function () {
              return (function CT() {
                return x($y);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const ET = new O("Location Initialized");
      let $y = (() => {
        class e extends sc {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return vn().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = vn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = vn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, i) {
            By() ? this._history.pushState(n, r, i) : (this.location.hash = i);
          }
          replaceState(n, r, i) {
            By()
              ? this._history.replaceState(n, r, i)
              : (this.location.hash = i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Ze));
          }),
          (e.ɵprov = H({
            token: e,
            factory: function () {
              return (function bT() {
                return new $y(x(Ze));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function By() {
        return !!window.history.pushState;
      }
      function ac(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function Hy(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function tn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Gn = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({
            token: e,
            factory: function () {
              return fe(zy);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const Uy = new O("appBaseHref");
      let zy = (() => {
          class e extends Gn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  fe(Ze).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return ac(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  tn(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && n ? `${r}${i}` : r;
            }
            pushState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + tn(o));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + tn(o));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(sc), x(Uy, 8));
            }),
            (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        IT = (() => {
          class e extends Gn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = ac(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + tn(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + tn(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(sc), x(Uy, 8));
            }),
            (e.ɵprov = H({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Ms = (() => {
          class e {
            constructor(n) {
              (this._subject = new ze()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._baseHref = Hy(Gy(r))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + tn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function MT(e, t) {
                  return e && t.startsWith(e) ? t.substring(e.length) : t;
                })(this._baseHref, Gy(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", i = null) {
              this._locationStrategy.pushState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + tn(r)),
                  i
                );
            }
            replaceState(n, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + tn(r)),
                  i
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((i) => i(n, r));
            }
            subscribe(n, r, i) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (e.normalizeQueryParams = tn),
            (e.joinWithSlash = ac),
            (e.stripTrailingSlash = Hy),
            (e.ɵfac = function (n) {
              return new (n || e)(x(Gn));
            }),
            (e.ɵprov = H({
              token: e,
              factory: function () {
                return (function ST() {
                  return new Ms(x(Gn));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function Gy(e) {
        return e.replace(/\/index.html$/, "");
      }
      class hA {
        constructor(t, n, r, i) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let yc = (() => {
        class e {
          constructor(n, r, i) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new hA(i.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), nv(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((i) => {
              nv(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Et), M(Jt), M(Is));
          }),
          (e.ɵdir = Ne({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function nv(e, t) {
        e.context.$implicit = t.item;
      }
      let rv = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new gA()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            iv("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            iv("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Et), M(Jt));
          }),
          (e.ɵdir = Ne({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          e
        );
      })();
      class gA {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function iv(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${ee(t)}'.`
          );
      }
      let HA = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = An({ type: e })),
          (e.ɵinj = an({})),
          e
        );
      })();
      let WA = (() => {
        class e {}
        return (
          (e.ɵprov = H({
            token: e,
            providedIn: "root",
            factory: () => new qA(x(Ze), window),
          })),
          e
        );
      })();
      class qA {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function QA(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(t) || o.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            i = n.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              uv(this.window.history) ||
              uv(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function uv(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class bc extends class C1 extends class _T {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function wT(e) {
            Ss || (Ss = e);
          })(new bc());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function E1() {
            return (
              (zi = zi || document.querySelector("base")),
              zi ? zi.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function b1(e) {
                (Vs = Vs || document.createElement("a")),
                  Vs.setAttribute("href", e);
                const t = Vs.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          zi = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function cA(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [i, o] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (i.trim() === t) return decodeURIComponent(o);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Vs,
        zi = null;
      const hv = new O("TRANSITION_ID"),
        S1 = [
          {
            provide: vs,
            useFactory: function I1(e, t, n) {
              return () => {
                n.get(Ds).donePromise.then(() => {
                  const r = vn(),
                    i = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let o = 0; o < i.length; o++) r.remove(i[o]);
                });
              };
            },
            deps: [hv, Ze, Dt],
            multi: !0,
          },
        ];
      let T1 = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const $s = new O("EventManagerPlugins");
      let Bs = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((i) => (i.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, i) {
            return this._findPluginFor(r).addEventListener(n, r, i);
          }
          addGlobalEventListener(n, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const i = this._plugins;
            for (let o = 0; o < i.length; o++) {
              const s = i[o];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x($s), x(be));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class pv {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const i = vn().getGlobalEventTarget(this._doc, t);
          if (!i)
            throw new Error(`Unsupported event target ${i} for event ${n}`);
          return this.addEventListener(i, n, r);
        }
      }
      let gv = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((i) => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = H({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Gi = (() => {
          class e extends gv {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, i) {
              n.forEach((o) => {
                const s = this._doc.createElement("style");
                (s.textContent = o), i.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(mv), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(n, i, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(mv));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Ze));
            }),
            (e.ɵprov = H({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function mv(e) {
        vn().remove(e);
      }
      const Ic = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Sc = /%COMP%/g;
      function Hs(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let i = t[r];
          Array.isArray(i) ? Hs(e, i, n) : ((i = i.replace(Sc, e)), n.push(i));
        }
        return n;
      }
      function Dv(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let Mc = (() => {
        class e {
          constructor(n, r, i) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Tc(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case xt.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return (
                  i ||
                    ((i = new F1(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, i)),
                  i.applyToHost(n),
                  i
                );
              }
              case 1:
              case xt.ShadowDom:
                return new O1(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = Hs(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(i),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Bs), x(Gi), x(Vi));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Tc {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(Ic[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (_v(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (_v(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, i) {
          if (i) {
            n = i + ":" + n;
            const o = Ic[i];
            o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const i = Ic[r];
            i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, i) {
          i & (Qe.DashCase | Qe.Important)
            ? t.style.setProperty(n, r, i & Qe.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & Qe.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Dv(r))
            : this.eventManager.addEventListener(t, n, Dv(r));
        }
      }
      function _v(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class F1 extends Tc {
        constructor(t, n, r, i) {
          super(t), (this.component = r);
          const o = Hs(i + "-" + r.id, r.styles, []);
          n.addStyles(o),
            (this.contentAttr = (function R1(e) {
              return "_ngcontent-%COMP%".replace(Sc, e);
            })(i + "-" + r.id)),
            (this.hostAttr = (function N1(e) {
              return "_nghost-%COMP%".replace(Sc, e);
            })(i + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class O1 extends Tc {
        constructor(t, n, r, i) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = Hs(i.id, i.styles, []);
          for (let s = 0; s < o.length; s++) {
            const a = document.createElement("style");
            (a.textContent = o[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let k1 = (() => {
        class e extends pv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, i) {
            return (
              n.addEventListener(r, i, !1),
              () => this.removeEventListener(n, r, i)
            );
          }
          removeEventListener(n, r, i) {
            return n.removeEventListener(r, i);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Ze));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Cv = ["alt", "control", "meta", "shift"],
        L1 = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        j1 = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let V1 = (() => {
        class e extends pv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, i) {
            const o = e.parseEventName(r),
              s = e.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => vn().onAndCancel(n, o.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              Cv.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const u = {};
            return (u.domEventName = i), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let i = L1[n.key] || n.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = n.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                Cv.forEach((s) => {
                  s !== i && (0, j1[s])(n) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(n, r, i) {
            return (o) => {
              e.matchEventFullKeyCode(o, n) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Ze));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const U1 = _y(yT, "browser", [
          { provide: dy, useValue: "browser" },
          {
            provide: cy,
            useValue: function $1() {
              bc.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Ze,
            useFactory: function H1() {
              return (
                (function lE(e) {
                  Iu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        Iv = new O(""),
        Sv = [
          {
            provide: ws,
            useClass: class M1 {
              addToWindow(t) {
                (ne.getAngularTestability = (r, i = !0) => {
                  const o = t.findTestabilityInTree(r, i);
                  if (null == o)
                    throw new Error("Could not find testability for element.");
                  return o;
                }),
                  (ne.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (ne.getAllAngularRootElements = () => t.getAllRootElements()),
                  ne.frameworkStabilizers || (ne.frameworkStabilizers = []),
                  ne.frameworkStabilizers.push((r) => {
                    const i = ne.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), o--, 0 == o && r(s);
                    };
                    i.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? vn().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: yy, useClass: Kl, deps: [be, Yl, ws] },
          { provide: Kl, useClass: Kl, deps: [be, Yl, ws] },
        ],
        Mv = [
          { provide: Fu, useValue: "root" },
          {
            provide: vr,
            useFactory: function B1() {
              return new vr();
            },
            deps: [],
          },
          { provide: $s, useClass: k1, multi: !0, deps: [Ze, be, dy] },
          { provide: $s, useClass: V1, multi: !0, deps: [Ze] },
          { provide: Mc, useClass: Mc, deps: [Bs, Gi, Vi] },
          { provide: Wh, useExisting: Mc },
          { provide: gv, useExisting: Gi },
          { provide: Gi, useClass: Gi, deps: [Ze] },
          { provide: Bs, useClass: Bs, deps: [$s, be] },
          { provide: class ZA {}, useClass: T1, deps: [] },
          [],
        ];
      let z1 = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: Vi, useValue: n.appId },
                  { provide: hv, useExisting: Vi },
                  S1,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Iv, 12));
            }),
            (e.ɵmod = An({ type: e })),
            (e.ɵinj = an({ providers: [...Mv, ...Sv], imports: [HA, vT] })),
            e
          );
        })(),
        Tv = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Ze));
            }),
            (e.ɵprov = H({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function W1() {
                        return new Tv(x(Ze));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function A(...e) {
        return we(e, Qr(e));
      }
      typeof window < "u" && window;
      class Mt extends Tt {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      const Us = Gr(
          (e) =>
            function () {
              e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence");
            }
        ),
        { isArray: ex } = Array,
        { getPrototypeOf: tx, prototype: nx, keys: rx } = Object;
      const { isArray: sx } = Array;
      function Rv(...e) {
        const t = Qr(e),
          n = (function Fw(e) {
            return te(wa(e)) ? e.pop() : void 0;
          })(e),
          { args: r, keys: i } = (function ix(e) {
            if (1 === e.length) {
              const t = e[0];
              if (ex(t)) return { args: t, keys: null };
              if (
                (function ox(e) {
                  return e && "object" == typeof e && tx(e) === nx;
                })(t)
              ) {
                const n = rx(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === r.length) return we([], t);
        const o = new De(
          (function cx(e, t, n = Tn) {
            return (r) => {
              Nv(
                t,
                () => {
                  const { length: i } = e,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let u = 0; u < i; u++)
                    Nv(
                      t,
                      () => {
                        const l = we(e[u], t);
                        let c = !1;
                        l.subscribe(
                          Te(
                            r,
                            (d) => {
                              (o[u] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(
            r,
            t,
            i
              ? (s) =>
                  (function lx(e, t) {
                    return e.reduce((n, r, i) => ((n[r] = t[i]), n), {});
                  })(i, s)
              : Tn
          )
        );
        return n
          ? o.pipe(
              (function ux(e) {
                return Q((t) =>
                  (function ax(e, t) {
                    return sx(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(n)
            )
          : o;
      }
      function Nv(e, t, n) {
        e ? Vt(n, e, t) : t();
      }
      function Rc(...e) {
        return (function dx() {
          return Yn(1);
        })()(we(e, Qr(e)));
      }
      function Pv(e) {
        return new De((t) => {
          At(e()).subscribe(t);
        });
      }
      function Wi(e, t) {
        const n = te(e) ? e : () => e,
          r = (i) => i.error(n());
        return new De(t ? (i) => t.schedule(r, 0, i) : r);
      }
      function Nc() {
        return Me((e, t) => {
          let n = null;
          e._refCount++;
          const r = Te(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const i = e._connection,
              o = n;
            (n = null),
              i && (!o || i === o) && i.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class Fv extends De {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Td(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new st();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Te(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = st.EMPTY));
          }
          return t;
        }
        refCount() {
          return Nc()(this);
        }
      }
      function Lt(e, t) {
        return Me((n, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          n.subscribe(
            Te(
              r,
              (u) => {
                i?.unsubscribe();
                let l = 0;
                const c = o++;
                At(e(u, c)).subscribe(
                  (i = Te(
                    r,
                    (d) => r.next(t ? t(u, d, c, l++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function qi(e) {
        return e <= 0
          ? () => $t
          : Me((t, n) => {
              let r = 0;
              t.subscribe(
                Te(n, (i) => {
                  ++r <= e && (n.next(i), e <= r && n.complete());
                })
              );
            });
      }
      function wn(e, t) {
        return Me((n, r) => {
          let i = 0;
          n.subscribe(Te(r, (o) => e.call(t, o, i++) && r.next(o)));
        });
      }
      function zs(e) {
        return Me((t, n) => {
          let r = !1;
          t.subscribe(
            Te(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function Ov(e = hx) {
        return Me((t, n) => {
          let r = !1;
          t.subscribe(
            Te(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function hx() {
        return new Us();
      }
      function _n(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? wn((i, o) => e(i, o, r)) : Tn,
            qi(1),
            n ? zs(t) : Ov(() => new Us())
          );
      }
      function Wn(e, t) {
        return te(t) ? xe(e, t, 1) : xe(e, 1);
      }
      function Le(e, t, n) {
        const r = te(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Me((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                Te(
                  o,
                  (u) => {
                    var l;
                    null === (l = r.next) || void 0 === l || l.call(r, u),
                      o.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      o.complete();
                  },
                  (u) => {
                    var l;
                    (a = !1),
                      null === (l = r.error) || void 0 === l || l.call(r, u),
                      o.error(u);
                  },
                  () => {
                    var u, l;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (l = r.finalize) || void 0 === l || l.call(r);
                  }
                )
              );
            })
          : Tn;
      }
      function Cn(e) {
        return Me((t, n) => {
          let o,
            r = null,
            i = !1;
          (r = t.subscribe(
            Te(n, void 0, void 0, (s) => {
              (o = At(e(s, Cn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(n));
        });
      }
      function px(e, t, n, r, i) {
        return (o, s) => {
          let a = n,
            u = t,
            l = 0;
          o.subscribe(
            Te(
              s,
              (c) => {
                const d = l++;
                (u = a ? e(u, c, d) : ((a = !0), c)), r && s.next(u);
              },
              i &&
                (() => {
                  a && s.next(u), s.complete();
                })
            )
          );
        };
      }
      function kv(e, t) {
        return Me(px(e, t, arguments.length >= 2, !0));
      }
      function Pc(e) {
        return e <= 0
          ? () => $t
          : Me((t, n) => {
              let r = [];
              t.subscribe(
                Te(
                  n,
                  (i) => {
                    r.push(i), e < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) n.next(i);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function Lv(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? wn((i, o) => e(i, o, r)) : Tn,
            Pc(1),
            n ? zs(t) : Ov(() => new Us())
          );
      }
      function Fc(e) {
        return Me((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const U = "primary",
        Qi = Symbol("RouteTitle");
      class yx {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function jr(e) {
        return new yx(e);
      }
      function vx(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = e[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: i };
      }
      function jt(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let i;
        for (let o = 0; o < n.length; o++)
          if (((i = n[o]), !jv(e[i], t[i]))) return !1;
        return !0;
      }
      function jv(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((i, o) => r[o] === i);
        }
        return e === t;
      }
      function Vv(e) {
        return Array.prototype.concat.apply([], e);
      }
      function $v(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Re(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function En(e) {
        return eg(e) ? e : as(e) ? we(Promise.resolve(e)) : A(e);
      }
      const _x = {
          exact: function Uv(e, t, n) {
            if (
              !Qn(e.segments, t.segments) ||
              !Gs(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !Uv(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: zv,
        },
        Bv = {
          exact: function Cx(e, t) {
            return jt(e, t);
          },
          subset: function Ex(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => jv(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function Hv(e, t, n) {
        return (
          _x[n.paths](e.root, t.root, n.matrixParams) &&
          Bv[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function zv(e, t, n) {
        return Gv(e, t, t.segments, n);
      }
      function Gv(e, t, n, r) {
        if (e.segments.length > n.length) {
          const i = e.segments.slice(0, n.length);
          return !(!Qn(i, n) || t.hasChildren() || !Gs(i, n, r));
        }
        if (e.segments.length === n.length) {
          if (!Qn(e.segments, n) || !Gs(e.segments, n, r)) return !1;
          for (const i in t.children)
            if (!e.children[i] || !zv(e.children[i], t.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = n.slice(0, e.segments.length),
            o = n.slice(e.segments.length);
          return (
            !!(Qn(e.segments, i) && Gs(e.segments, i, r) && e.children[U]) &&
            Gv(e.children[U], t, o, r)
          );
        }
      }
      function Gs(e, t, n) {
        return t.every((r, i) => Bv[n](e[i].parameters, r.parameters));
      }
      class qn {
        constructor(t, n, r) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = jr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return Sx.serialize(this);
        }
      }
      class z {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Re(n, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Ws(this);
        }
      }
      class Zi {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = jr(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return Zv(this);
        }
      }
      function Qn(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let Wv = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({
            token: e,
            factory: function () {
              return new kc();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class kc {
        parse(t) {
          const n = new Ox(t);
          return new qn(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${Ki(t.root, !0)}`,
            r = (function Ax(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((i) => `${qs(n)}=${qs(i)}`).join("&")
                    : `${qs(n)}=${qs(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function Mx(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const Sx = new kc();
      function Ws(e) {
        return e.segments.map((t) => Zv(t)).join("/");
      }
      function Ki(e, t) {
        if (!e.hasChildren()) return Ws(e);
        if (t) {
          const n = e.children[U] ? Ki(e.children[U], !1) : "",
            r = [];
          return (
            Re(e.children, (i, o) => {
              o !== U && r.push(`${o}:${Ki(i, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function Ix(e, t) {
            let n = [];
            return (
              Re(e.children, (r, i) => {
                i === U && (n = n.concat(t(r, i)));
              }),
              Re(e.children, (r, i) => {
                i !== U && (n = n.concat(t(r, i)));
              }),
              n
            );
          })(e, (r, i) =>
            i === U ? [Ki(e.children[U], !1)] : [`${i}:${Ki(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[U]
            ? `${Ws(e)}/${n[0]}`
            : `${Ws(e)}/(${n.join("//")})`;
        }
      }
      function qv(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function qs(e) {
        return qv(e).replace(/%3B/gi, ";");
      }
      function Lc(e) {
        return qv(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Qs(e) {
        return decodeURIComponent(e);
      }
      function Qv(e) {
        return Qs(e.replace(/\+/g, "%20"));
      }
      function Zv(e) {
        return `${Lc(e.path)}${(function Tx(e) {
          return Object.keys(e)
            .map((t) => `;${Lc(t)}=${Lc(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const xx = /^[^\/()?;=#]+/;
      function Zs(e) {
        const t = e.match(xx);
        return t ? t[0] : "";
      }
      const Rx = /^[^=?&#]+/,
        Px = /^[^&#]+/;
      class Ox {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new z([], {})
              : new z([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[U] = new z(t, n)),
            r
          );
        }
        parseSegment() {
          const t = Zs(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new S(4009, !1);
          return this.capture(t), new Zi(Qs(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = Zs(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = Zs(this.remaining);
            i && ((r = i), this.capture(r));
          }
          t[Qs(n)] = Qs(r);
        }
        parseQueryParam(t) {
          const n = (function Nx(e) {
            const t = e.match(Rx);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function Fx(e) {
              const t = e.match(Px);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = Qv(n),
            o = Qv(r);
          if (t.hasOwnProperty(i)) {
            let s = t[i];
            Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o);
          } else t[i] = o;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Zs(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new S(4010, !1);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.slice(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : t && (o = U);
            const s = this.parseChildren();
            (n[o] = 1 === Object.keys(s).length ? s[U] : new z([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new S(4011, !1);
        }
      }
      function jc(e) {
        return e.segments.length > 0 ? new z([], { [U]: e }) : e;
      }
      function Ks(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const o = Ks(e.children[r]);
          (o.segments.length > 0 || o.hasChildren()) && (t[r] = o);
        }
        return (function kx(e) {
          if (1 === e.numberOfChildren && e.children[U]) {
            const t = e.children[U];
            return new z(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new z(e.segments, t));
      }
      function Zn(e) {
        return e instanceof qn;
      }
      function Vx(e, t, n, r, i) {
        if (0 === n.length) return Vr(t.root, t.root, t.root, r, i);
        const o = (function Jv(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new Yv(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  Re(o.outlets, (u, l) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new Yv(n, t, r);
        })(n);
        return o.toRoot()
          ? Vr(t.root, t.root, new z([], {}), r, i)
          : (function s(u) {
              const l = (function Bx(e, t, n, r) {
                  if (e.isAbsolute) return new $r(t.root, !0, 0);
                  if (-1 === r) return new $r(n, n === t.root, 0);
                  return (function Xv(e, t, n) {
                    let r = e,
                      i = t,
                      o = n;
                    for (; o > i; ) {
                      if (((o -= i), (r = r.parent), !r)) throw new S(4005, !1);
                      i = r.segments.length;
                    }
                    return new $r(r, !1, i - o);
                  })(n, r + (Yi(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(o, t, e.snapshot?._urlSegment, u),
                c = l.processChildren
                  ? Xi(l.segmentGroup, l.index, o.commands)
                  : $c(l.segmentGroup, l.index, o.commands);
              return Vr(t.root, l.segmentGroup, c, r, i);
            })(e.snapshot?._lastPathIndex);
      }
      function Yi(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Ji(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Vr(e, t, n, r, i) {
        let s,
          o = {};
        r &&
          Re(r, (u, l) => {
            o[l] = Array.isArray(u) ? u.map((c) => `${c}`) : `${u}`;
          }),
          (s = e === t ? n : Kv(e, t, n));
        const a = jc(Ks(s));
        return new qn(a, o, i);
      }
      function Kv(e, t, n) {
        const r = {};
        return (
          Re(e.children, (i, o) => {
            r[o] = i === t ? n : Kv(i, t, n);
          }),
          new z(e.segments, r)
        );
      }
      class Yv {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && Yi(r[0]))
          )
            throw new S(4003, !1);
          const i = r.find(Ji);
          if (i && i !== $v(r)) throw new S(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class $r {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function $c(e, t, n) {
        if (
          (e || (e = new z([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return Xi(e, t, n);
        const r = (function Ux(e, t, n) {
            let r = 0,
              i = t;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (r >= n.length) return o;
              const s = e.segments[i],
                a = n[r];
              if (Ji(a)) break;
              const u = `${a}`,
                l = r < n.length - 1 ? n[r + 1] : null;
              if (i > 0 && void 0 === u) break;
              if (u && l && "object" == typeof l && void 0 === l.outlets) {
                if (!tD(u, l, s)) return o;
                r += 2;
              } else {
                if (!tD(u, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(e, t, n),
          i = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const o = new z(e.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[U] = new z(e.segments.slice(r.pathIndex), e.children)),
            Xi(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new z(e.segments, {})
          : r.match && !e.hasChildren()
          ? Bc(e, t, n)
          : r.match
          ? Xi(e, 0, i)
          : Bc(e, t, n);
      }
      function Xi(e, t, n) {
        if (0 === n.length) return new z(e.segments, {});
        {
          const r = (function Hx(e) {
              return Ji(e[0]) ? e[0].outlets : { [U]: e };
            })(n),
            i = {};
          return (
            Re(r, (o, s) => {
              "string" == typeof o && (o = [o]),
                null !== o && (i[s] = $c(e.children[s], t, o));
            }),
            Re(e.children, (o, s) => {
              void 0 === r[s] && (i[s] = o);
            }),
            new z(e.segments, i)
          );
        }
      }
      function Bc(e, t, n) {
        const r = e.segments.slice(0, t);
        let i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (Ji(o)) {
            const u = zx(o.outlets);
            return new z(r, u);
          }
          if (0 === i && Yi(n[0])) {
            r.push(new Zi(e.segments[t].path, eD(n[0]))), i++;
            continue;
          }
          const s = Ji(o) ? o.outlets[U] : `${o}`,
            a = i < n.length - 1 ? n[i + 1] : null;
          s && a && Yi(a)
            ? (r.push(new Zi(s, eD(a))), (i += 2))
            : (r.push(new Zi(s, {})), i++);
        }
        return new z(r, {});
      }
      function zx(e) {
        const t = {};
        return (
          Re(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = Bc(new z([], {}), 0, n));
          }),
          t
        );
      }
      function eD(e) {
        const t = {};
        return Re(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function tD(e, t, n) {
        return e == n.path && jt(t, n.parameters);
      }
      class rn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class Hc extends rn {
        constructor(t, n, r = "imperative", i = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class bn extends rn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Ys extends rn {
        constructor(t, n, r, i) {
          super(t, n), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class nD extends rn {
        constructor(t, n, r, i) {
          super(t, n), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class Gx extends rn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Wx extends rn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class qx extends rn {
        constructor(t, n, r, i, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class Qx extends rn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Zx extends rn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Kx {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class Yx {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class Jx {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Xx {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class eR {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class tR {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class rD {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class iD {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Uc(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = Uc(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = zc(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== t);
        }
        pathFromRoot(t) {
          return zc(t, this._root).map((n) => n.value);
        }
      }
      function Uc(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Uc(e, n);
          if (r) return r;
        }
        return null;
      }
      function zc(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = zc(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class on {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Br(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class oD extends iD {
        constructor(t, n) {
          super(t), (this.snapshot = n), Gc(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function sD(e, t) {
        const n = (function rR(e, t) {
            const s = new Js([], {}, {}, "", {}, U, t, null, e.root, -1, {});
            return new uD("", new on(s, []));
          })(e, t),
          r = new Mt([new Zi("", {})]),
          i = new Mt({}),
          o = new Mt({}),
          s = new Mt({}),
          a = new Mt(""),
          u = new In(r, i, s, a, o, U, t, n.root);
        return (u.snapshot = n.root), new oD(new on(u, []), n);
      }
      class In {
        constructor(t, n, r, i, o, s, a, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe(Q((l) => l[Qi])) ?? A(void 0)),
            (this._futureSnapshot = u);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(Q((t) => jr(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(Q((t) => jr(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function aD(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const i = n[r],
              o = n[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function iR(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class Js {
        constructor(t, n, r, i, o, s, a, u, l, c, d, f) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.[Qi]),
            (this.routeConfig = u),
            (this._urlSegment = l),
            (this._lastPathIndex = c),
            (this._correctedLastPathIndex = f ?? c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = jr(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = jr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class uD extends iD {
        constructor(t, n) {
          super(n), (this.url = t), Gc(this, n);
        }
        toString() {
          return lD(this._root);
        }
      }
      function Gc(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Gc(e, n));
      }
      function lD(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(lD).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Wc(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            jt(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            jt(t.params, n.params) || e.params.next(n.params),
            (function Dx(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!jt(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            jt(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function qc(e, t) {
        const n =
          jt(e.params, t.params) &&
          (function bx(e, t) {
            return (
              Qn(e, t) && e.every((n, r) => jt(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || qc(e.parent, t.parent))
        );
      }
      function eo(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const i = (function sR(e, t, n) {
            return t.children.map((r) => {
              for (const i of n.children)
                if (e.shouldReuseRoute(r.value, i.value.snapshot))
                  return eo(e, r, i);
              return eo(e, r);
            });
          })(e, t, n);
          return new on(r, i);
        }
        {
          if (e.shouldAttach(t.value)) {
            const o = e.retrieve(t.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => eo(e, a))),
                s
              );
            }
          }
          const r = (function aR(e) {
              return new In(
                new Mt(e.url),
                new Mt(e.params),
                new Mt(e.queryParams),
                new Mt(e.fragment),
                new Mt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            i = t.children.map((o) => eo(e, o));
          return new on(r, i);
        }
      }
      const Qc = "ngNavigationCancelingError";
      function cD(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = Zn(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          i = dD(!1, 0, t);
        return (i.url = n), (i.navigationBehaviorOptions = r), i;
      }
      function dD(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Qc] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function fD(e) {
        return hD(e) && Zn(e.url);
      }
      function hD(e) {
        return e && e[Qc];
      }
      class uR {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new to()),
            (this.attachRef = null);
        }
      }
      let to = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const i = this.getOrCreateContext(n);
            (i.outlet = r), this.contexts.set(n, i);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new uR()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Xs = !1;
      let Zc = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.changeDetector = o),
              (this.environmentInjector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new ze()),
              (this.deactivateEvents = new ze()),
              (this.attachEvents = new ze()),
              (this.detachEvents = new ze()),
              (this.name = i || U),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.getContext(this.name)?.outlet === this &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.injector));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new S(4012, Xs);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new S(4012, Xs);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new S(4012, Xs);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new S(4013, Xs);
            this._activatedRoute = n;
            const i = this.location,
              s = n._futureSnapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new lR(n, a, i.injector);
            if (
              r &&
              (function cR(e) {
                return !!e.resolveComponentFactory;
              })(r)
            ) {
              const l = r.resolveComponentFactory(s);
              this.activated = i.createComponent(l, i.length, u);
            } else
              this.activated = i.createComponent(s, {
                index: i.length,
                injector: u,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(
              M(to),
              M(Et),
              (function oi(e) {
                return (function q_(e, t) {
                  if ("class" === t) return e.classes;
                  if ("style" === t) return e.styles;
                  const n = e.attrs;
                  if (n) {
                    const r = n.length;
                    let i = 0;
                    for (; i < r; ) {
                      const o = n[i];
                      if (Ef(o)) break;
                      if (0 === o) i += 2;
                      else if ("number" == typeof o)
                        for (i++; i < r && "string" == typeof n[i]; ) i++;
                      else {
                        if (o === t) return n[i + 1];
                        i += 2;
                      }
                    }
                  }
                  return null;
                })(_e(), e);
              })("name"),
              M(tc),
              M(hn)
            );
          }),
          (e.ɵdir = Ne({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
          })),
          e
        );
      })();
      class lR {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === In
            ? this.route
            : t === to
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let Kc = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Ut({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [Im],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && se(0, "router-outlet");
            },
            dependencies: [Zc],
            encapsulation: 2,
          })),
          e
        );
      })();
      function pD(e, t) {
        return (
          e.providers &&
            !e._injector &&
            (e._injector = ps(e.providers, t, `Route: ${e.path}`)),
          e._injector ?? t
        );
      }
      function Jc(e) {
        const t = e.children && e.children.map(Jc),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== U &&
            (n.component = Kc),
          n
        );
      }
      function ht(e) {
        return e.outlet || U;
      }
      function gD(e, t) {
        const n = e.filter((r) => ht(r) === t);
        return n.push(...e.filter((r) => ht(r) !== t)), n;
      }
      function no(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class gR {
        constructor(t, n, r, i) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = i);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            Wc(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const i = Br(n);
          t.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            Re(i, (o, s) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else o && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = Br(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = Br(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const i = Br(n);
          t.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new tR(o.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new Xx(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if ((Wc(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Wc(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = no(i.snapshot),
                u = a?.get(Ei) ?? null;
              (s.attachRef = null),
                (s.route = i),
                (s.resolver = u),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class mD {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class ea {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function mR(e, t, n) {
        const r = e._root;
        return ro(r, t ? t._root : null, n, [r.value]);
      }
      function Hr(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function Kw(e) {
              return null !== po(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function ro(
        e,
        t,
        n,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = Br(t);
        return (
          e.children.forEach((s) => {
            (function vR(
              e,
              t,
              n,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const u = (function DR(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !Qn(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !Qn(e.url, t.url) || !jt(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !qc(e, t) || !jt(e.queryParams, t.queryParams);
                    default:
                      return !qc(e, t);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                u
                  ? i.canActivateChecks.push(new mD(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  ro(e, t, o.component ? (a ? a.children : null) : n, r, i),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new ea(a.outlet.component, s));
              } else
                s && io(t, a, i),
                  i.canActivateChecks.push(new mD(r)),
                  ro(e, null, o.component ? (a ? a.children : null) : n, r, i);
            })(s, o[s.value.outlet], n, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          Re(o, (s, a) => io(s, n.getContext(a), i)),
          i
        );
      }
      function io(e, t, n) {
        const r = Br(e),
          i = e.value;
        Re(r, (o, s) => {
          io(o, i.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new ea(
              i.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              i
            )
          );
      }
      function oo(e) {
        return "function" == typeof e;
      }
      function Xc(e) {
        return e instanceof Us || "EmptyError" === e?.name;
      }
      const ta = Symbol("INITIAL_VALUE");
      function Ur() {
        return Lt((e) =>
          Rv(
            e.map((t) =>
              t.pipe(
                qi(1),
                (function fx(...e) {
                  const t = Qr(e);
                  return Me((n, r) => {
                    (t ? Rc(e, n, t) : Rc(e, n)).subscribe(r);
                  });
                })(ta)
              )
            )
          ).pipe(
            Q((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === ta) return ta;
                  if (!1 === n || n instanceof qn) return n;
                }
              return !0;
            }),
            wn((t) => t !== ta),
            qi(1)
          )
        );
      }
      function yD(e) {
        return (function JD(...e) {
          return Id(e);
        })(
          Le((t) => {
            if (Zn(t)) throw cD(0, t);
          }),
          Q((t) => !0 === t)
        );
      }
      const ed = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function vD(e, t, n, r, i) {
        const o = td(e, t, n);
        return o.matched
          ? (function kR(e, t, n, r) {
              const i = t.canMatch;
              return i && 0 !== i.length
                ? A(
                    i.map((s) => {
                      const a = Hr(s, e);
                      return En(
                        (function IR(e) {
                          return e && oo(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(Ur(), yD())
                : A(!0);
            })((r = pD(t, r)), t, n).pipe(Q((s) => (!0 === s ? o : { ...ed })))
          : A(o);
      }
      function td(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...ed }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || vx)(n, e, t);
        if (!i) return { ...ed };
        const o = {};
        Re(i.posParams, (a, u) => {
          o[u] = a.path;
        });
        const s =
          i.consumed.length > 0
            ? { ...o, ...i.consumed[i.consumed.length - 1].parameters }
            : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: n.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function na(e, t, n, r, i = "corrected") {
        if (
          n.length > 0 &&
          (function VR(e, t, n) {
            return n.some((r) => ra(e, t, r) && ht(r) !== U);
          })(e, n, r)
        ) {
          const s = new z(
            t,
            (function jR(e, t, n, r) {
              const i = {};
              (i[U] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const o of n)
                if ("" === o.path && ht(o) !== U) {
                  const s = new z([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (i[ht(o)] = s);
                }
              return i;
            })(e, t, r, new z(n, e.children))
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function $R(e, t, n) {
            return n.some((r) => ra(e, t, r));
          })(e, n, r)
        ) {
          const s = new z(
            e.segments,
            (function LR(e, t, n, r, i, o) {
              const s = {};
              for (const a of r)
                if (ra(e, n, a) && !i[ht(a)]) {
                  const u = new z([], {});
                  (u._sourceSegment = e),
                    (u._segmentIndexShift =
                      "legacy" === o ? e.segments.length : t.length),
                    (s[ht(a)] = u);
                }
              return { ...i, ...s };
            })(e, t, n, r, e.children, i)
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const o = new z(e.segments, e.children);
        return (
          (o._sourceSegment = e),
          (o._segmentIndexShift = t.length),
          { segmentGroup: o, slicedSegments: n }
        );
      }
      function ra(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function DD(e, t, n, r) {
        return (
          !!(ht(e) === r || (r !== U && ra(t, n, e))) &&
          ("**" === e.path || td(t, e, n).matched)
        );
      }
      function wD(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      const ia = !1;
      class oa {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class _D {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function so(e) {
        return Wi(new oa(e));
      }
      function CD(e) {
        return Wi(new _D(e));
      }
      class zR {
        constructor(t, n, r, i, o) {
          (this.injector = t),
            (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = o),
            (this.allowRedirects = !0);
        }
        apply() {
          const t = na(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new z(t.segments, t.children);
          return this.expandSegmentGroup(this.injector, this.config, n, U)
            .pipe(
              Q((o) =>
                this.createUrlTree(
                  Ks(o),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              Cn((o) => {
                if (o instanceof _D)
                  return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof oa ? this.noMatchError(o) : o;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.injector, this.config, t.root, U)
            .pipe(
              Q((i) => this.createUrlTree(Ks(i), t.queryParams, t.fragment))
            )
            .pipe(
              Cn((i) => {
                throw i instanceof oa ? this.noMatchError(i) : i;
              })
            );
        }
        noMatchError(t) {
          return new S(4002, ia);
        }
        createUrlTree(t, n, r) {
          const i = jc(t);
          return new qn(i, n, r);
        }
        expandSegmentGroup(t, n, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe(Q((o) => new z([], o)))
            : this.expandSegment(t, r, n, r.segments, i, !0);
        }
        expandChildren(t, n, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return we(i).pipe(
            Wn((o) => {
              const s = r.children[o],
                a = gD(n, o);
              return this.expandSegmentGroup(t, a, s, o).pipe(
                Q((u) => ({ segment: u, outlet: o }))
              );
            }),
            kv((o, s) => ((o[s.outlet] = s.segment), o), {}),
            Lv()
          );
        }
        expandSegment(t, n, r, i, o, s) {
          return we(r).pipe(
            Wn((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, i, o, s).pipe(
                Cn((l) => {
                  if (l instanceof oa) return A(null);
                  throw l;
                })
              )
            ),
            _n((a) => !!a),
            Cn((a, u) => {
              if (Xc(a)) return wD(n, i, o) ? A(new z([], {})) : so(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, n, r, i, o, s, a) {
          return DD(i, n, o, s)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, i, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s)
              : so(n)
            : so(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, i) {
          const o = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? CD(o)
            : this.lineralizeSegments(r, o).pipe(
                xe((s) => {
                  const a = new z(s, {});
                  return this.expandSegment(t, a, n, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: l,
            positionalParamSegments: c,
          } = td(n, i, o);
          if (!a) return so(n);
          const d = this.applyRedirectCommands(u, i.redirectTo, c);
          return i.redirectTo.startsWith("/")
            ? CD(d)
            : this.lineralizeSegments(i, d).pipe(
                xe((f) => this.expandSegment(t, n, r, f.concat(l), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, n, r, i, o) {
          return "**" === r.path
            ? ((t = pD(r, t)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? A({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(t, r)
                  ).pipe(
                    Q(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new z(i, {})
                      )
                    )
                  )
                : A(new z(i, {})))
            : vD(n, r, i, t).pipe(
                Lt(
                  ({ matched: s, consumedSegments: a, remainingSegments: u }) =>
                    s
                      ? this.getChildConfig((t = r._injector ?? t), r, i).pipe(
                          xe((c) => {
                            const d = c.injector ?? t,
                              f = c.routes,
                              { segmentGroup: h, slicedSegments: p } = na(
                                n,
                                a,
                                u,
                                f
                              ),
                              g = new z(h.segments, h.children);
                            if (0 === p.length && g.hasChildren())
                              return this.expandChildren(d, f, g).pipe(
                                Q((y) => new z(a, y))
                              );
                            if (0 === f.length && 0 === p.length)
                              return A(new z(a, {}));
                            const m = ht(r) === o;
                            return this.expandSegment(
                              d,
                              g,
                              f,
                              p,
                              m ? U : o,
                              !0
                            ).pipe(
                              Q((E) => new z(a.concat(E.segments), E.children))
                            );
                          })
                        )
                      : so(n)
                )
              );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? A({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? A({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function OR(e, t, n, r) {
                  const i = t.canLoad;
                  return void 0 === i || 0 === i.length
                    ? A(!0)
                    : A(
                        i.map((s) => {
                          const a = Hr(s, e);
                          return En(
                            (function _R(e) {
                              return e && oo(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(Ur(), yD());
                })(t, n, r).pipe(
                  xe((i) =>
                    i
                      ? this.configLoader.loadChildren(t, n).pipe(
                          Le((o) => {
                            (n._loadedRoutes = o.routes),
                              (n._loadedInjector = o.injector);
                          })
                        )
                      : (function HR(e) {
                          return Wi(dD(ia, 3));
                        })()
                  )
                )
            : A({ routes: [], injector: t });
        }
        lineralizeSegments(t, n) {
          let r = [],
            i = n.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return A(r);
            if (i.numberOfChildren > 1 || !i.children[U])
              return Wi(new S(4e3, ia));
            i = i.children[U];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, n, r, i) {
          const o = this.createSegmentGroup(t, n.root, r, i);
          return new qn(
            o,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Re(t, (i, o) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = n[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, i) {
          const o = this.createSegments(t, n.segments, r, i);
          let s = {};
          return (
            Re(n.children, (a, u) => {
              s[u] = this.createSegmentGroup(t, a, r, i);
            }),
            new z(o, s)
          );
        }
        createSegments(t, n, r, i) {
          return n.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(t, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(t, n, r) {
          const i = r[n.path.substring(1)];
          if (!i) throw new S(4001, ia);
          return i;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const i of n) {
            if (i.path === t.path) return n.splice(r), i;
            r++;
          }
          return t;
        }
      }
      class WR {}
      class ZR {
        constructor(t, n, r, i, o, s, a, u) {
          (this.injector = t),
            (this.rootComponentType = n),
            (this.config = r),
            (this.urlTree = i),
            (this.url = o),
            (this.paramsInheritanceStrategy = s),
            (this.relativeLinkResolution = a),
            (this.urlSerializer = u);
        }
        recognize() {
          const t = na(
            this.urlTree.root,
            [],
            [],
            this.config.filter((n) => void 0 === n.redirectTo),
            this.relativeLinkResolution
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            U
          ).pipe(
            Q((n) => {
              if (null === n) return null;
              const r = new Js(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  U,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                i = new on(r, n),
                o = new uD(this.url, i);
              return this.inheritParamsAndData(o._root), o;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = aD(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, n, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, i);
        }
        processChildren(t, n, r) {
          return we(Object.keys(r.children)).pipe(
            Wn((i) => {
              const o = r.children[i],
                s = gD(n, i);
              return this.processSegmentGroup(t, s, o, i);
            }),
            kv((i, o) => (i && o ? (i.push(...o), i) : null)),
            (function gx(e, t = !1) {
              return Me((n, r) => {
                let i = 0;
                n.subscribe(
                  Te(r, (o) => {
                    const s = e(o, i++);
                    (s || t) && r.next(o), !s && r.complete();
                  })
                );
              });
            })((i) => null !== i),
            zs(null),
            Lv(),
            Q((i) => {
              if (null === i) return null;
              const o = ED(i);
              return (
                (function KR(e) {
                  e.sort((t, n) =>
                    t.value.outlet === U
                      ? -1
                      : n.value.outlet === U
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(o),
                o
              );
            })
          );
        }
        processSegment(t, n, r, i, o) {
          return we(n).pipe(
            Wn((s) =>
              this.processSegmentAgainstRoute(s._injector ?? t, s, r, i, o)
            ),
            _n((s) => !!s),
            Cn((s) => {
              if (Xc(s)) return wD(r, i, o) ? A([]) : A(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, i, o) {
          if (n.redirectTo || !DD(n, r, i, o)) return A(null);
          let s;
          if ("**" === n.path) {
            const a = i.length > 0 ? $v(i).parameters : {},
              u = ID(r) + i.length;
            s = A({
              snapshot: new Js(
                i,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                MD(n),
                ht(n),
                n.component ?? n._loadedComponent ?? null,
                n,
                bD(r),
                u,
                TD(n),
                u
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = vD(r, n, i, t).pipe(
              Q(
                ({
                  matched: a,
                  consumedSegments: u,
                  remainingSegments: l,
                  parameters: c,
                }) => {
                  if (!a) return null;
                  const d = ID(r) + u.length;
                  return {
                    snapshot: new Js(
                      u,
                      c,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      MD(n),
                      ht(n),
                      n.component ?? n._loadedComponent ?? null,
                      n,
                      bD(r),
                      d,
                      TD(n),
                      d
                    ),
                    consumedSegments: u,
                    remainingSegments: l,
                  };
                }
              )
            );
          return s.pipe(
            Lt((a) => {
              if (null === a) return A(null);
              const {
                snapshot: u,
                consumedSegments: l,
                remainingSegments: c,
              } = a;
              t = n._injector ?? t;
              const d = n._loadedInjector ?? t,
                f = (function YR(e) {
                  return e.children
                    ? e.children
                    : e.loadChildren
                    ? e._loadedRoutes
                    : [];
                })(n),
                { segmentGroup: h, slicedSegments: p } = na(
                  r,
                  l,
                  c,
                  f.filter((m) => void 0 === m.redirectTo),
                  this.relativeLinkResolution
                );
              if (0 === p.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(
                  Q((m) => (null === m ? null : [new on(u, m)]))
                );
              if (0 === f.length && 0 === p.length) return A([new on(u, [])]);
              const g = ht(n) === o;
              return this.processSegment(d, f, h, p, g ? U : o).pipe(
                Q((m) => (null === m ? null : [new on(u, m)]))
              );
            })
          );
        }
      }
      function JR(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function ED(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!JR(r)) {
            t.push(r);
            continue;
          }
          const i = t.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), n.add(i)) : t.push(r);
        }
        for (const r of n) {
          const i = ED(r.children);
          t.push(new on(r.value, i));
        }
        return t.filter((r) => !n.has(r));
      }
      function bD(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function ID(e) {
        let t = e,
          n = t._segmentIndexShift ?? 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment), (n += t._segmentIndexShift ?? 0);
        return n - 1;
      }
      function MD(e) {
        return e.data || {};
      }
      function TD(e) {
        return e.resolve || {};
      }
      function AD(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function nd(e) {
        return Lt((t) => {
          const n = e(t);
          return n ? we(n).pipe(Q(() => t)) : A(t);
        });
      }
      let xD = (() => {
          class e {
            buildTitle(n) {
              let r,
                i = n.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((o) => o.outlet === U));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Qi];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = H({
              token: e,
              factory: function () {
                return fe(RD);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        RD = (() => {
          class e extends xD {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Tv));
            }),
            (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      class sN {}
      class uN extends class aN {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      } {}
      const aa = new O("", { providedIn: "root", factory: () => ({}) }),
        rd = new O("ROUTES");
      let id = (() => {
        class e {
          constructor(n, r) {
            (this.injector = n),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return A(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = En(n.loadComponent()).pipe(
                Le((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = o);
                }),
                Fc(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              i = new Fv(r, () => new Tt()).pipe(Nc());
            return this.componentLoaders.set(n, i), i;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return A({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                Q((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let u,
                    l,
                    c = !1;
                  Array.isArray(a)
                    ? (l = a)
                    : ((u = a.create(n).injector),
                      (l = Vv(u.get(rd, [], N.Self | N.Optional))));
                  return { routes: l.map(Jc), injector: u };
                }),
                Fc(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new Fv(o, () => new Tt()).pipe(Nc());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return En(n()).pipe(
              xe((r) =>
                r instanceof Em || Array.isArray(r)
                  ? A(r)
                  : we(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Dt), x(Wl));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class cN {}
      class dN {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, n) {
          return t;
        }
      }
      function fN(e) {
        throw e;
      }
      function hN(e, t, n) {
        return t.parse("/");
      }
      const pN = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        gN = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      function PD() {
        const e = fe(Wv),
          t = fe(to),
          n = fe(Ms),
          r = fe(Dt),
          i = fe(Wl),
          o = fe(rd, { optional: !0 }) ?? [],
          s = fe(aa, { optional: !0 }) ?? {},
          a = fe(RD),
          u = fe(xD, { optional: !0 }),
          l = fe(cN, { optional: !0 }),
          c = fe(sN, { optional: !0 }),
          d = new Se(null, e, t, n, r, i, Vv(o));
        return (
          l && (d.urlHandlingStrategy = l),
          c && (d.routeReuseStrategy = c),
          (d.titleStrategy = u ?? a),
          (function mN(e, t) {
            e.errorHandler && (t.errorHandler = e.errorHandler),
              e.malformedUriErrorHandler &&
                (t.malformedUriErrorHandler = e.malformedUriErrorHandler),
              e.onSameUrlNavigation &&
                (t.onSameUrlNavigation = e.onSameUrlNavigation),
              e.paramsInheritanceStrategy &&
                (t.paramsInheritanceStrategy = e.paramsInheritanceStrategy),
              e.relativeLinkResolution &&
                (t.relativeLinkResolution = e.relativeLinkResolution),
              e.urlUpdateStrategy &&
                (t.urlUpdateStrategy = e.urlUpdateStrategy),
              e.canceledNavigationResolution &&
                (t.canceledNavigationResolution =
                  e.canceledNavigationResolution);
          })(s, d),
          d
        );
      }
      let Se = (() => {
        class e {
          constructor(n, r, i, o, s, a, u) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = i),
              (this.location = o),
              (this.config = u),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new Tt()),
              (this.errorHandler = fN),
              (this.malformedUriErrorHandler = hN),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => A(void 0)),
              (this.urlHandlingStrategy = new dN()),
              (this.routeReuseStrategy = new uN()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.configLoader = s.get(id)),
              (this.configLoader.onLoadEndListener = (f) =>
                this.triggerEvent(new Yx(f))),
              (this.configLoader.onLoadStartListener = (f) =>
                this.triggerEvent(new Kx(f))),
              (this.ngModule = s.get(Un)),
              (this.console = s.get(LM));
            const d = s.get(be);
            (this.isNgZoneEnabled = d instanceof be && be.isInAngularZone()),
              this.resetConfig(u),
              (this.currentUrlTree = (function wx() {
                return new qn(new z([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = sD(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new Mt({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            return this.location.getState()?.ɵrouterPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              wn((i) => 0 !== i.id),
              Q((i) => ({
                ...i,
                extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl),
              })),
              Lt((i) => {
                let o = !1,
                  s = !1;
                return A(i).pipe(
                  Le((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? {
                            ...this.lastSuccessfulNavigation,
                            previousNavigation: null,
                          }
                        : null,
                    };
                  }),
                  Lt((a) => {
                    const u = this.browserUrlTree.toString(),
                      l =
                        !this.navigated ||
                        a.extractedUrl.toString() !== u ||
                        u !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || l) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        FD(a.source) && (this.browserUrlTree = a.extractedUrl),
                        A(a).pipe(
                          Lt((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new Hc(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? $t
                                : Promise.resolve(d)
                            );
                          }),
                          (function GR(e, t, n, r) {
                            return Lt((i) =>
                              (function UR(e, t, n, r, i) {
                                return new zR(e, t, n, r, i).apply();
                              })(e, t, n, i.extractedUrl, r).pipe(
                                Q((o) => ({ ...i, urlAfterRedirects: o }))
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          Le((d) => {
                            (this.currentNavigation = {
                              ...this.currentNavigation,
                              finalUrl: d.urlAfterRedirects,
                            }),
                              (i.urlAfterRedirects = d.urlAfterRedirects);
                          }),
                          (function eN(e, t, n, r, i, o) {
                            return xe((s) =>
                              (function QR(
                                e,
                                t,
                                n,
                                r,
                                i,
                                o,
                                s = "emptyOnly",
                                a = "legacy"
                              ) {
                                return new ZR(e, t, n, r, i, s, a, o)
                                  .recognize()
                                  .pipe(
                                    Lt((u) =>
                                      null === u
                                        ? (function qR(e) {
                                            return new De((t) => t.error(e));
                                          })(new WR())
                                        : A(u)
                                    )
                                  );
                              })(
                                e,
                                t,
                                n,
                                s.urlAfterRedirects,
                                r.serialize(s.urlAfterRedirects),
                                r,
                                i,
                                o
                              ).pipe(Q((a) => ({ ...s, targetSnapshot: a })))
                            );
                          })(
                            this.ngModule.injector,
                            this.rootComponentType,
                            this.config,
                            this.urlSerializer,
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          Le((d) => {
                            if (
                              ((i.targetSnapshot = d.targetSnapshot),
                              "eager" === this.urlUpdateStrategy)
                            ) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new Gx(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (
                      l &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: g,
                          extras: m,
                        } = a,
                        C = new Hc(f, this.serializeUrl(h), p, g);
                      r.next(C);
                      const E = sD(h, this.rootComponentType).snapshot;
                      return A(
                        (i = {
                          ...a,
                          targetSnapshot: E,
                          urlAfterRedirects: h,
                          extras: {
                            ...m,
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          },
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), $t;
                  }),
                  Le((a) => {
                    const u = new Wx(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(u);
                  }),
                  Q(
                    (a) =>
                      (i = {
                        ...a,
                        guards: mR(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts
                        ),
                      })
                  ),
                  (function MR(e, t) {
                    return xe((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: i,
                        guards: {
                          canActivateChecks: o,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === o.length
                        ? A({ ...n, guardsResult: !0 })
                        : (function TR(e, t, n, r) {
                            return we(e).pipe(
                              xe((i) =>
                                (function FR(e, t, n, r, i) {
                                  const o =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return o && 0 !== o.length
                                    ? A(
                                        o.map((a) => {
                                          const u = no(t) ?? i,
                                            l = Hr(a, u);
                                          return En(
                                            (function bR(e) {
                                              return e && oo(e.canDeactivate);
                                            })(l)
                                              ? l.canDeactivate(e, t, n, r)
                                              : u.runInContext(() =>
                                                  l(e, t, n, r)
                                                )
                                          ).pipe(_n());
                                        })
                                      ).pipe(Ur())
                                    : A(!0);
                                })(i.component, i.route, n, t, r)
                              ),
                              _n((i) => !0 !== i, !0)
                            );
                          })(s, r, i, e).pipe(
                            xe((a) =>
                              a &&
                              (function wR(e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function AR(e, t, n, r) {
                                    return we(t).pipe(
                                      Wn((i) =>
                                        Rc(
                                          (function RR(e, t) {
                                            return (
                                              null !== e && t && t(new Jx(e)),
                                              A(!0)
                                            );
                                          })(i.route.parent, r),
                                          (function xR(e, t) {
                                            return (
                                              null !== e && t && t(new eR(e)),
                                              A(!0)
                                            );
                                          })(i.route, r),
                                          (function PR(e, t, n) {
                                            const r = t[t.length - 1],
                                              o = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function yR(e) {
                                                    const t = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: e, guards: t }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  Pv(() =>
                                                    A(
                                                      s.guards.map((u) => {
                                                        const l =
                                                            no(s.node) ?? n,
                                                          c = Hr(u, l);
                                                        return En(
                                                          (function ER(e) {
                                                            return (
                                                              e &&
                                                              oo(
                                                                e.canActivateChild
                                                              )
                                                            );
                                                          })(c)
                                                            ? c.canActivateChild(
                                                                r,
                                                                e
                                                              )
                                                            : l.runInContext(
                                                                () => c(r, e)
                                                              )
                                                        ).pipe(_n());
                                                      })
                                                    ).pipe(Ur())
                                                  )
                                                );
                                            return A(o).pipe(Ur());
                                          })(e, i.path, n),
                                          (function NR(e, t, n) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return A(!0);
                                            const i = r.map((o) =>
                                              Pv(() => {
                                                const s = no(t) ?? n,
                                                  a = Hr(o, s);
                                                return En(
                                                  (function CR(e) {
                                                    return (
                                                      e && oo(e.canActivate)
                                                    );
                                                  })(a)
                                                    ? a.canActivate(t, e)
                                                    : s.runInContext(() =>
                                                        a(t, e)
                                                      )
                                                ).pipe(_n());
                                              })
                                            );
                                            return A(i).pipe(Ur());
                                          })(e, i.route, n)
                                        )
                                      ),
                                      _n((i) => !0 !== i, !0)
                                    );
                                  })(r, o, e, t)
                                : A(a)
                            ),
                            Q((a) => ({ ...n, guardsResult: a }))
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  Le((a) => {
                    if (((i.guardsResult = a.guardsResult), Zn(a.guardsResult)))
                      throw cD(0, a.guardsResult);
                    const u = new qx(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(u);
                  }),
                  wn(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, "", 3),
                      !1)
                  ),
                  nd((a) => {
                    if (a.guards.canActivateChecks.length)
                      return A(a).pipe(
                        Le((u) => {
                          const l = new Qx(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        }),
                        Lt((u) => {
                          let l = !1;
                          return A(u).pipe(
                            (function tN(e, t) {
                              return xe((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: i },
                                } = n;
                                if (!i.length) return A(n);
                                let o = 0;
                                return we(i).pipe(
                                  Wn((s) =>
                                    (function nN(e, t, n, r) {
                                      const i = e.routeConfig,
                                        o = e._resolve;
                                      return (
                                        void 0 !== i?.title &&
                                          !AD(i) &&
                                          (o[Qi] = i.title),
                                        (function rN(e, t, n, r) {
                                          const i = (function iN(e) {
                                            return [
                                              ...Object.keys(e),
                                              ...Object.getOwnPropertySymbols(
                                                e
                                              ),
                                            ];
                                          })(e);
                                          if (0 === i.length) return A({});
                                          const o = {};
                                          return we(i).pipe(
                                            xe((s) =>
                                              (function oN(e, t, n, r) {
                                                const i = no(t) ?? r,
                                                  o = Hr(e, i);
                                                return En(
                                                  o.resolve
                                                    ? o.resolve(t, n)
                                                    : i.runInContext(() =>
                                                        o(t, n)
                                                      )
                                                );
                                              })(e[s], t, n, r).pipe(
                                                _n(),
                                                Le((a) => {
                                                  o[s] = a;
                                                })
                                              )
                                            ),
                                            Pc(1),
                                            (function mx(e) {
                                              return Q(() => e);
                                            })(o),
                                            Cn((s) => (Xc(s) ? $t : Wi(s)))
                                          );
                                        })(o, e, t, r).pipe(
                                          Q(
                                            (s) => (
                                              (e._resolvedData = s),
                                              (e.data = aD(e, n).resolve),
                                              i &&
                                                AD(i) &&
                                                (e.data[Qi] = i.title),
                                              null
                                            )
                                          )
                                        )
                                      );
                                    })(s.route, r, e, t)
                                  ),
                                  Le(() => o++),
                                  Pc(1),
                                  xe((s) => (o === i.length ? A(n) : $t))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            Le({
                              next: () => (l = !0),
                              complete: () => {
                                l ||
                                  (this.restoreHistory(u),
                                  this.cancelNavigationTransition(u, "", 2));
                              },
                            })
                          );
                        }),
                        Le((u) => {
                          const l = new Zx(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        })
                      );
                  }),
                  nd((a) => {
                    const u = (l) => {
                      const c = [];
                      l.routeConfig?.loadComponent &&
                        !l.routeConfig._loadedComponent &&
                        c.push(
                          this.configLoader.loadComponent(l.routeConfig).pipe(
                            Le((d) => {
                              l.component = d;
                            }),
                            Q(() => {})
                          )
                        );
                      for (const d of l.children) c.push(...u(d));
                      return c;
                    };
                    return Rv(u(a.targetSnapshot.root)).pipe(zs(), qi(1));
                  }),
                  nd(() => this.afterPreactivation()),
                  Q((a) => {
                    const u = (function oR(e, t, n) {
                      const r = eo(e, t._root, n ? n._root : void 0);
                      return new oD(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return (i = { ...a, targetRouterState: u });
                  }),
                  Le((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, t, n) =>
                    Q(
                      (r) => (
                        new gR(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          n
                        ).activate(e),
                        r
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  Le({
                    next() {
                      o = !0;
                    },
                    complete() {
                      o = !0;
                    },
                  }),
                  Fc(() => {
                    o || s || this.cancelNavigationTransition(i, "", 1),
                      this.currentNavigation?.id === i.id &&
                        (this.currentNavigation = null);
                  }),
                  Cn((a) => {
                    if (((s = !0), hD(a))) {
                      fD(a) ||
                        ((this.navigated = !0), this.restoreHistory(i, !0));
                      const u = new Ys(
                        i.id,
                        this.serializeUrl(i.extractedUrl),
                        a.message,
                        a.cancellationCode
                      );
                      if ((r.next(u), fD(a))) {
                        const l = this.urlHandlingStrategy.merge(
                            a.url,
                            this.rawUrlTree
                          ),
                          c = {
                            skipLocationChange: i.extras.skipLocationChange,
                            replaceUrl:
                              "eager" === this.urlUpdateStrategy ||
                              FD(i.source),
                          };
                        this.scheduleNavigation(l, "imperative", null, c, {
                          resolve: i.resolve,
                          reject: i.reject,
                          promise: i.promise,
                        });
                      } else i.resolve(!1);
                    } else {
                      this.restoreHistory(i, !0);
                      const u = new nD(
                        i.id,
                        this.serializeUrl(i.extractedUrl),
                        a,
                        i.targetSnapshot ?? void 0
                      );
                      r.next(u);
                      try {
                        i.resolve(this.errorHandler(a));
                      } catch (l) {
                        i.reject(l);
                      }
                    }
                    return $t;
                  })
                );
              })
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next({ ...this.transitions.value, ...n });
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    const i = { replaceUrl: !0 },
                      o = n.state?.navigationId ? n.state : null;
                    if (o) {
                      const a = { ...o };
                      delete a.navigationId,
                        delete a.ɵrouterPageId,
                        0 !== Object.keys(a).length && (i.state = a);
                    }
                    const s = this.parseUrl(n.url);
                    this.scheduleNavigation(s, r, o, i);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            (this.config = n.map(Jc)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: i,
                queryParams: o,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              l = i || this.routerState.root,
              c = u ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = { ...this.currentUrlTree.queryParams, ...o };
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = o || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              Vx(l, this.currentUrlTree, n, d, c ?? null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const i = Zn(n) ? n : this.parseUrl(n),
              o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(o, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function yN(e) {
                for (let t = 0; t < e.length; t++) {
                  if (null == e[t]) throw new S(4008, false);
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let i;
            if (((i = !0 === r ? { ...pN } : !1 === r ? { ...gN } : r), Zn(n)))
              return Hv(this.currentUrlTree, n, i);
            const o = this.parseUrl(n);
            return Hv(this.currentUrlTree, o, i);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, i) => {
              const o = n[i];
              return null != o && (r[i] = o), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new bn(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  this.titleStrategy?.updateTitle(this.routerState.snapshot),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              }
            );
          }
          scheduleNavigation(n, r, i, o, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, l;
            s
              ? ((a = s.resolve), (u = s.reject), (l = s.promise))
              : (l = new Promise((f, h) => {
                  (a = f), (u = h);
                }));
            const c = ++this.navigationId;
            let d;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (i = this.location.getState()),
                  (d =
                    i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1))
                : (d = 0),
              this.setTransition({
                id: c,
                targetPageId: d,
                source: r,
                restoredState: i,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: o,
                resolve: a,
                reject: u,
                promise: l,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              l.catch((f) => Promise.reject(f))
            );
          }
          setBrowserUrl(n, r) {
            const i = this.urlSerializer.serialize(n),
              o = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, r.targetPageId),
              };
            this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl
              ? this.location.replaceState(i, "", o)
              : this.location.go(i, "", o);
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !== this.currentNavigation?.finalUrl) ||
              0 === i
                ? this.currentUrlTree === this.currentNavigation?.finalUrl &&
                  0 === i &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(i);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(n, r, i) {
            const o = new Ys(n.id, this.serializeUrl(n.extractedUrl), r, i);
            this.triggerEvent(o), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            Gu();
          }),
          (e.ɵprov = H({
            token: e,
            factory: function () {
              return PD();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      function FD(e) {
        return "imperative" !== e;
      }
      class OD {}
      let wN = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this.router = n),
              (this.injector = i),
              (this.preloadingStrategy = o),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                wn((n) => n instanceof bn),
                Wn(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const i = [];
            for (const o of r) {
              o.providers &&
                !o._injector &&
                (o._injector = ps(o.providers, n, `Route: ${o.path}`));
              const s = o._injector ?? n,
                a = o._loadedInjector ?? s;
              (o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
              (o.loadComponent && !o._loadedComponent)
                ? i.push(this.preloadConfig(s, o))
                : (o.children || o._loadedRoutes) &&
                  i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return we(i).pipe(Yn());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : A(null);
              const o = i.pipe(
                xe((s) =>
                  null === s
                    ? A(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? we([o, this.loader.loadComponent(r)]).pipe(Yn())
                : o;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Se), x(Wl), x(hn), x(OD), x(id));
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ad = new O("");
      let kD = (() => {
        class e {
          constructor(n, r, i = {}) {
            (this.router = n),
              (this.viewportScroller = r),
              (this.options = i),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (i.scrollPositionRestoration =
                i.scrollPositionRestoration || "disabled"),
              (i.anchorScrolling = i.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.router.events.subscribe((n) => {
              n instanceof Hc
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof bn &&
                  ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.router.parseUrl(n.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.router.events.subscribe((n) => {
              n instanceof rD &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.router.triggerEvent(
              new rD(
                n,
                "popstate" === this.lastSource
                  ? this.store[this.restoredId]
                  : null,
                r
              )
            );
          }
          ngOnDestroy() {
            this.routerEventsSubscription &&
              this.routerEventsSubscription.unsubscribe(),
              this.scrollEventsSubscription &&
                this.scrollEventsSubscription.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            Gu();
          }),
          (e.ɵprov = H({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function zr(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function ud(e) {
        return [{ provide: rd, multi: !0, useValue: e }];
      }
      function jD() {
        const e = fe(Dt);
        return (t) => {
          const n = e.get(_s);
          if (t !== n.components[0]) return;
          const r = e.get(Se),
            i = e.get(VD);
          1 === e.get(ld) && r.initialNavigation(),
            e.get($D, null, N.Optional)?.setUpPreloading(),
            e.get(ad, null, N.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            i.closed || (i.next(), i.unsubscribe());
        };
      }
      const VD = new O("", { factory: () => new Tt() }),
        ld = new O("", { providedIn: "root", factory: () => 1 });
      const $D = new O("");
      function bN(e) {
        return zr(0, [
          { provide: $D, useExisting: wN },
          { provide: OD, useExisting: e },
        ]);
      }
      const BD = new O("ROUTER_FORROOT_GUARD"),
        IN = [
          Ms,
          { provide: Wv, useClass: kc },
          { provide: Se, useFactory: PD },
          to,
          {
            provide: In,
            useFactory: function LD(e) {
              return e.routerState.root;
            },
            deps: [Se],
          },
          id,
        ];
      function SN() {
        return new Dy("Router", Se);
      }
      let HD = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                IN,
                [],
                ud(n),
                {
                  provide: BD,
                  useFactory: xN,
                  deps: [[Se, new fi(), new hi()]],
                },
                { provide: aa, useValue: r || {} },
                r?.useHash
                  ? { provide: Gn, useClass: IT }
                  : { provide: Gn, useClass: zy },
                {
                  provide: ad,
                  useFactory: () => {
                    const e = fe(Se),
                      t = fe(WA),
                      n = fe(aa);
                    return (
                      n.scrollOffset && t.setOffset(n.scrollOffset),
                      new kD(e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? bN(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: Dy, multi: !0, useFactory: SN },
                r?.initialNavigation ? RN(r) : [],
                [
                  { provide: UD, useFactory: jD },
                  { provide: fy, multi: !0, useExisting: UD },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [ud(n)] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(BD, 8));
          }),
          (e.ɵmod = An({ type: e })),
          (e.ɵinj = an({ imports: [Kc] })),
          e
        );
      })();
      function xN(e) {
        return "guarded";
      }
      function RN(e) {
        return [
          "disabled" === e.initialNavigation
            ? zr(3, [
                {
                  provide: vs,
                  multi: !0,
                  useFactory: () => {
                    const t = fe(Se);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: ld, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? zr(2, [
                { provide: ld, useValue: 0 },
                {
                  provide: vs,
                  multi: !0,
                  deps: [Dt],
                  useFactory: (t) => {
                    const n = t.get(ET, Promise.resolve());
                    let r = !1;
                    return () =>
                      n.then(
                        () =>
                          new Promise((o) => {
                            const s = t.get(Se),
                              a = t.get(VD);
                            (function i(o) {
                              t.get(Se)
                                .events.pipe(
                                  wn(
                                    (a) =>
                                      a instanceof bn ||
                                      a instanceof Ys ||
                                      a instanceof nD
                                  ),
                                  Q(
                                    (a) =>
                                      a instanceof bn ||
                                      (a instanceof Ys &&
                                        (0 === a.code || 1 === a.code) &&
                                        null)
                                  ),
                                  wn((a) => null !== a),
                                  qi(1)
                                )
                                .subscribe(() => {
                                  o();
                                });
                            })(() => {
                              o(!0), (r = !0);
                            }),
                              (s.afterPreactivation = () => (
                                o(!0), r || a.closed ? A(void 0) : a
                              )),
                              s.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const UD = new O(""),
        cd = [
          {
            id: 1,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-1.jpg"],
          },
          {
            id: 2,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-2.jpg"],
          },
          {
            id: 3,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-3.jpg"],
          },
          {
            id: 4,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-4.jpg"],
          },
          {
            id: 5,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-6.jpg"],
          },
          {
            id: 6,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-7.jpg"],
          },
          {
            id: 7,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-7.jpg"],
          },
          {
            id: 8,
            title: "Titulo titulo",
            category: "Design",
            content: "Conte\xfado conte\xfado conte\xfado",
            images: ["projects/work-8.jpg"],
          },
        ];
      function PN(e, t) {
        1 & e && se(0, "img", 6), 2 & e && Bn("src", t.$implicit, _i);
      }
      let FN = (() => {
        class e {
          constructor(n, r) {
            (this.activatedRoute = n),
              (this.location = r),
              (this.projectId = this.activatedRoute.snapshot.params.projectId);
            var i = cd.find((o) => o.id == this.projectId);
            this.project = i ?? cd[0];
          }
          ngOnInit() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(In), M(Ms));
          }),
          (e.ɵcmp = Ut({
            type: e,
            selectors: [["app-project"]],
            decls: 8,
            vars: 3,
            consts: [
              ["id", "about", 1, "s-about", "target-section", "pt-5"],
              [
                "data-aos",
                "fade-up",
                1,
                "row",
                "section-header",
                "widder",
                "aos-init",
                "aos-animate",
                "mx-auto",
                "mt-5",
                "pt-5",
              ],
              [1, "display-3", "fw-bolder"],
              [1, "mt-5"],
              [
                "id",
                "images",
                1,
                "row",
                "section-header",
                "widder",
                "mx-auto",
                "d-flex",
              ],
              ["class", "col-auto", 3, "src", 4, "ngFor", "ngForOf"],
              [1, "col-auto", 3, "src"],
            ],
            template: function (n, r) {
              1 & n &&
                (v(0, "section", 0)(1, "div", 1)(2, "h1", 2),
                _(3),
                D(),
                v(4, "p", 3),
                _(5),
                D()(),
                v(6, "div", 4),
                ss(7, PN, 1, 1, "img", 5),
                D()()),
                2 & n &&
                  (Zt(3),
                  ls(" ", r.project.title, " "),
                  Zt(2),
                  xi(r.project.content),
                  Zt(2),
                  Bn("ngForOf", r.project.images));
            },
            dependencies: [yc],
          })),
          e
        );
      })();
      function ON(e, t) {
        if (1 & e) {
          const n = (function Jp() {
            return w();
          })();
          v(0, "div", 77)(1, "div", 78),
            Ti("click", function () {
              const o = (function cf(e) {
                return (k.lFrame.contextLView = e), e[8];
              })(n).$implicit;
              return (function df(e) {
                return (k.lFrame.contextLView = null), e;
              })(og().openProject(o.id));
            }),
            se(2, "img", 79),
            v(3, "div", 18)(4, "span"),
            _(5),
            D(),
            v(6, "h3"),
            _(7),
            D()()()();
        }
        if (2 & e) {
          const n = t.$implicit;
          Zt(2),
            Bn("src", "/portfolio/assets/img/" + n.images[0], _i),
            Zt(3),
            xi(n.title),
            Zt(2),
            xi(n.category);
        }
      }
      const kN = [
        { path: "", redirectTo: "/home", pathMatch: "full" },
        {
          path: "home",
          component: (() => {
            class e {
              constructor(n) {
                (this.router = n), (this.projects = cd);
              }
              openProject(n) {
                this.router.navigate(["project/" + n]);
              }
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)(M(Se));
              }),
              (e.ɵcmp = Ut({
                type: e,
                selectors: [["app-home"]],
                decls: 286,
                vars: 1,
                consts: [
                  [
                    "id",
                    "home",
                    "data-parallax",
                    "scroll",
                    "data-image-src",
                    "/portfolio/assets/img/hero-bg.jpg",
                    "data-natural-width",
                    "3000",
                    "data-natural-height",
                    "2000",
                    "data-position-y",
                    "center",
                    1,
                    "s-home",
                    "page-hero",
                    "target-section",
                  ],
                  [1, "grid-overlay"],
                  [1, "home-content"],
                  [1, "d-flex-inline", "home-content__main"],
                  [1, "home-content__button"],
                  [
                    "href",
                    "home#about",
                    1,
                    "smoothscroll",
                    "btn",
                    "btn-primary",
                    "btn-large",
                  ],
                  [
                    "href",
                    "home#contact",
                    1,
                    "smoothscroll",
                    "btn",
                    "btn-large",
                  ],
                  [1, "home-content__scroll"],
                  ["href", "home#wwa", 1, "scroll-link", "smoothscroll"],
                  [1, "home-social"],
                  ["href", "home#0"],
                  ["aria-hidden", "true", 1, "fab", "fa-linkedin"],
                  ["aria-hidden", "true", 1, "fab", "fa-instagram"],
                  ["aria-hidden", "true", 1, "fab", "fa-behance"],
                  [
                    "id",
                    "wwa",
                    "data-natural-width",
                    "3000",
                    "data-natural-height",
                    "2000",
                    "data-position-y",
                    "center",
                    1,
                    "s-about",
                    "page-hero",
                    "target-section",
                    "min-vh-90",
                  ],
                  [1, "d-flex", "flex-wrap", "mx-0", "min-vh-90"],
                  [
                    1,
                    "col-md",
                    "text-center",
                    "d-flex",
                    "align-items-stretch",
                    "px-0",
                  ],
                  [
                    1,
                    "services-wrap",
                    "d-flex",
                    "align-items-center",
                    "filter",
                    "img",
                    2,
                    "background-image",
                    "url(/portfolio/assets/img/development.jpg)",
                  ],
                  [1, "text"],
                  [1, "font-bold"],
                  ["href", "home#pricing", 1, "btn-custom"],
                  [
                    1,
                    "col-md-3",
                    "text-center",
                    "d-flex",
                    "align-items-stretch",
                    "px-0",
                  ],
                  [1, "text-about", "py-5", "px-4", "mt-5"],
                  [1, "logo", "pb-3"],
                  [
                    1,
                    "services-wrap",
                    "d-flex",
                    "align-items-center",
                    "filter",
                    "img",
                    2,
                    "background-image",
                    "url(/portfolio/assets/img/design.jpg)",
                  ],
                  [1, "text", "inside"],
                  ["id", "about", 1, "s-about", "target-section"],
                  [
                    "data-aos",
                    "fade-up",
                    1,
                    "row",
                    "section-header",
                    "wide",
                    "aos-init",
                    "aos-animate",
                    "mx-auto",
                    "mt-5",
                    "pt-5",
                  ],
                  [
                    1,
                    "col-full",
                    "d-flex",
                    "flex-wrap",
                    "justify-content-between",
                  ],
                  [1, "col-md-8"],
                  [1, "subhead"],
                  [1, "display-2"],
                  [1, "col-md-4"],
                  [
                    1,
                    "cover_image",
                    "ms-auto",
                    "rounded-4",
                    2,
                    "background-image",
                    "url('https://img.freepik.com/fotos-premium/uma-pessoa-em-pe-na-frente-de-um-fundo-branco-solido_896360-8914.jpg')",
                    "height",
                    "100%",
                    "aspect-ratio",
                    "0.75",
                    "background-repeat",
                    "no-repeat",
                    "background-size",
                    "auto 100%",
                    "background-position-x",
                    "center",
                  ],
                  [
                    "id",
                    "services",
                    "data-natural-width",
                    "3000",
                    "data-natural-height",
                    "2000",
                    "data-position-y",
                    "center",
                    1,
                    "s-about",
                    "page-hero",
                    "target-section",
                    "min-vh-90",
                    "mt-5",
                    "pt-5",
                  ],
                  [
                    1,
                    "d-grid",
                    "align-items-center",
                    "justify-content-center",
                    "min-vh-90",
                  ],
                  [1, "d-flex", "justify-content-center", "pb-3"],
                  [
                    "data-aos",
                    "fade-up",
                    "data-aos-offset",
                    "0",
                    1,
                    "text-center",
                    "heading-section",
                  ],
                  [1, "subheading"],
                  [1, "mb-4"],
                  [
                    1,
                    "d-flex",
                    "flex-wrap",
                    "justify-content-evenly",
                    "no-gutters",
                  ],
                  [
                    "data-aos",
                    "flip-left",
                    "data-aos-delay",
                    "0",
                    "data-aos-duration",
                    "1000",
                    1,
                    "pe-none",
                    "col-md-6",
                    "col-lg-2",
                    "px-2",
                    "d-flex",
                    "card-item",
                    "rounded-1x",
                    "rounded-md-0",
                    "my-md-0",
                    "my-3",
                  ],
                  [1, "no-style"],
                  [1, "media", "block-6", "services", "d-block", "text-center"],
                  [1, "icon", "card-icon"],
                  [1, "fab", "fa-4x", "fa-twitter"],
                  [1, "media-body"],
                  [1, "heading", "mb-3"],
                  [
                    "data-aos",
                    "flip-left",
                    "data-aos-delay",
                    "800",
                    "data-aos-duration",
                    "1000",
                    1,
                    "pe-none",
                    "col-md-6",
                    "col-lg-2",
                    "px-2",
                    "d-flex",
                    "card-item",
                    "rounded-1x",
                    "rounded-md-0",
                    "my-md-0",
                    "my-3",
                  ],
                  [
                    "data-aos",
                    "flip-left",
                    "data-aos-delay",
                    "400",
                    "data-aos-duration",
                    "1000",
                    1,
                    "pe-none",
                    "col-md-6",
                    "col-lg-2",
                    "px-2",
                    "d-flex",
                    "card-item",
                    "rounded-1x",
                    "rounded-md-0",
                    "my-md-0",
                    "my-3",
                  ],
                  [
                    "data-aos",
                    "flip-left",
                    "data-aos-delay",
                    "1200",
                    "data-aos-duration",
                    "1000",
                    1,
                    "pe-none",
                    "col-md-6",
                    "col-lg-2",
                    "px-2",
                    "d-flex",
                    "card-item",
                    "rounded-1x",
                    "rounded-md-0",
                    "my-md-0",
                    "my-3",
                  ],
                  [
                    "id",
                    "pricing",
                    "data-natural-width",
                    "3000",
                    "data-natural-height",
                    "2000",
                    "data-position-y",
                    "center",
                    1,
                    "s-about",
                    "page-hero",
                    "target-section",
                    "min-vh-90",
                  ],
                  [1, "bit-narrow", "mx-auto"],
                  [1, "row", "justify-content-center", "pb-3", "w-100"],
                  [1, "col-md-10", "heading-section", "text-center"],
                  [1, "row", "w-100"],
                  [1, "col-md-3"],
                  [1, "pricing-entry", "pb-5", "text-center"],
                  [1, "price"],
                  [1, "per"],
                  [1, "button", "center"],
                  [
                    "href",
                    "home#",
                    1,
                    "btn",
                    "btn-primary",
                    "px-4",
                    "my-auto",
                    "py-4",
                    "fw-bolder",
                  ],
                  [1, "button", "text-center", "center"],
                  [1, "pricing-entry", "active", "pb-5", "text-center"],
                  [
                    "href",
                    "home#",
                    1,
                    "btn",
                    "btn-primary",
                    "px-4",
                    "py-3",
                    "my-auto",
                    "py-4",
                    "fw-bolder",
                  ],
                  [1, "row", "bit-narrow", "mx-auto"],
                  [1, "mb-0"],
                  [
                    1,
                    "about-process",
                    "process",
                    "block-1-2",
                    "block-tab-full",
                  ],
                  ["data-aos", "fade-up", 1, "col-block", "item-process"],
                  [1, "item-process__text"],
                  [1, "item-title"],
                  [
                    "id",
                    "services",
                    "data-natural-width",
                    "3000",
                    "data-natural-height",
                    "2000",
                    "data-position-y",
                    "center",
                    1,
                    "s-about",
                    "page-hero",
                    "target-section",
                    "min-vh-90",
                  ],
                  [1, "container"],
                  [
                    1,
                    "d-flex",
                    "no-gutters",
                    "justify-content-center",
                    "mb-5",
                    "pb-2",
                  ],
                  [1, "container-fluid", "p-0"],
                  [1, "d-flex", "flex-wrap", "no-gutters"],
                  ["class", "col-md-6 col-lg-3", 4, "ngFor", "ngForOf"],
                  [1, "col-md-6", "col-lg-3"],
                  [1, "project", 3, "click"],
                  ["alt", "Colorlib Template", 1, "img-fluid", 3, "src"],
                ],
                template: function (n, r) {
                  1 & n &&
                    (v(0, "section", 0)(1, "div", 1),
                    se(2, "div"),
                    D(),
                    v(3, "div", 2)(4, "div", 3)(5, "h1"),
                    _(6, "Maor"),
                    D(),
                    v(7, "h3"),
                    _(
                      8,
                      "Ag\xeancia especializada no desenvolvimento de Apps,"
                    ),
                    se(9, "br"),
                    _(10, "sites e designs que fa\xe7am a diferen\xe7a."),
                    D(),
                    v(11, "div", 4)(12, "a", 5),
                    _(13, " Nossos projetos "),
                    D(),
                    v(14, "a", 6),
                    _(15, " Fazer or\xe7amento "),
                    D()()(),
                    v(16, "div", 7)(17, "a", 8),
                    _(18, " Descer "),
                    D()()(),
                    v(19, "ul", 9)(20, "li")(21, "a", 10),
                    se(22, "i", 11),
                    v(23, "span"),
                    _(24, "Linkedin"),
                    D()()(),
                    v(25, "li")(26, "a", 10),
                    se(27, "i", 12),
                    v(28, "span"),
                    _(29, "Instagram"),
                    D()()(),
                    v(30, "li")(31, "a", 10),
                    se(32, "i", 13),
                    v(33, "span"),
                    _(34, "Behance"),
                    D()()()()(),
                    v(35, "section", 14)(36, "div", 15)(37, "div", 16)(
                      38,
                      "div",
                      17
                    )(39, "div", 18)(40, "h3", 19),
                    _(41, "Apps e Sites"),
                    D(),
                    v(42, "p")(43, "a", 20),
                    _(44, "Ver valores \u279e"),
                    D()()()()(),
                    v(45, "div", 21)(46, "div", 22)(47, "h1", 23),
                    _(48, "Maor"),
                    D(),
                    v(49, "h2"),
                    _(50, "Welcome to our Salon"),
                    D(),
                    v(51, "p"),
                    _(
                      52,
                      "Design e funcionalidade aliados para gerar interesse e conex\xe3o, \xe9 assim que trabalhamos na Maor. "
                    ),
                    D()()(),
                    v(53, "div", 16)(54, "div", 24)(55, "div", 25)(
                      56,
                      "h3",
                      19
                    ),
                    _(57, "Design de marcas"),
                    D(),
                    v(58, "p")(59, "a", 20),
                    _(60, "Ver valores \u279e"),
                    D()()()()()()(),
                    v(61, "section", 26)(62, "div", 27)(63, "div", 28)(
                      64,
                      "div",
                      29
                    )(65, "h3", 30),
                    _(66, "Who We Are"),
                    D(),
                    v(67, "h1", 31),
                    _(
                      68,
                      " We are Sublime, a design and branding agency with partners worldwide. We design thoughtful digital experiences and beautiful brand aesthetics. "
                    ),
                    D()(),
                    v(69, "div", 32),
                    se(70, "div", 33),
                    D()()()(),
                    v(71, "section", 34)(72, "div", 35)(73, "div")(
                      74,
                      "div",
                      36
                    )(75, "div", 37)(76, "span", 38),
                    _(77, "Servi\xe7os"),
                    D(),
                    v(78, "h2", 39),
                    _(79, "Menu de servi\xe7os"),
                    D(),
                    v(80, "p"),
                    _(
                      81,
                      "A Maor \xe9 uma ag\xeancia que pode atender voc\xea em seus mais variados projetos."
                    ),
                    se(82, "br"),
                    _(83, "D\xe1 uma olhada nos nossos principais servi\xe7os"),
                    D()()(),
                    v(84, "div", 40)(85, "div", 41)(86, "a", 42)(87, "div", 43)(
                      88,
                      "div",
                      44
                    ),
                    se(89, "i", 45),
                    D(),
                    v(90, "div", 46)(91, "h3", 47),
                    _(92, "Identidade visual"),
                    D(),
                    v(93, "p"),
                    _(
                      94,
                      "A small river named Duden flows by their place and supplies."
                    ),
                    D()()()()(),
                    v(95, "div", 48)(96, "a", 42)(97, "div", 43)(98, "div", 44),
                    se(99, "i", 45),
                    D(),
                    v(100, "div", 46)(101, "h3", 47),
                    _(102, "Aplicativos"),
                    D(),
                    v(103, "p"),
                    _(
                      104,
                      "A small river named Duden flows by their place and supplies."
                    ),
                    D()()()()(),
                    v(105, "div", 49)(106, "a", 42)(107, "div", 43)(
                      108,
                      "div",
                      44
                    ),
                    se(109, "i", 45),
                    D(),
                    v(110, "div", 46)(111, "h3", 47),
                    _(112, "Social media"),
                    D(),
                    v(113, "p"),
                    _(
                      114,
                      "A small river named Duden flows by their place and supplies."
                    ),
                    D()()()()(),
                    v(115, "div", 48)(116, "a", 42)(117, "div", 43)(
                      118,
                      "div",
                      44
                    ),
                    se(119, "i", 45),
                    D(),
                    v(120, "div", 46)(121, "h3", 47),
                    _(122, "Sistemas"),
                    D(),
                    v(123, "p"),
                    _(
                      124,
                      "A small river named Duden flows by their place and supplies."
                    ),
                    D()()()()(),
                    v(125, "div", 50)(126, "a", 42)(127, "div", 43)(
                      128,
                      "div",
                      44
                    ),
                    se(129, "i", 45),
                    D(),
                    v(130, "div", 46)(131, "h3", 47),
                    _(132, "Cria\xe7\xe3o de sites"),
                    D(),
                    v(133, "p"),
                    _(
                      134,
                      "A small river named Duden flows by their place and supplies."
                    ),
                    D()()()()()()()()(),
                    v(135, "section", 51)(136, "div", 52)(137, "div", 53)(
                      138,
                      "div",
                      54
                    )(139, "span", 38),
                    _(140, "Pacotes"),
                    D(),
                    v(141, "h2", 39),
                    _(142, "Our Prices"),
                    D(),
                    v(143, "p"),
                    _(
                      144,
                      "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia"
                    ),
                    D()()(),
                    v(145, "div", 55)(146, "div", 56)(147, "div", 57)(
                      148,
                      "div"
                    )(149, "h3", 39),
                    _(150, "Hair Style"),
                    D(),
                    v(151, "p")(152, "span", 58),
                    _(153, "$50.00"),
                    D(),
                    v(154, "span", 59),
                    _(155, "/ session"),
                    D()()(),
                    v(156, "ul")(157, "li"),
                    _(158, "Hair Dryer"),
                    D(),
                    v(159, "li"),
                    _(160, "Hair Coloring"),
                    D(),
                    v(161, "li"),
                    _(162, "Hair Cut"),
                    D(),
                    v(163, "li"),
                    _(164, "Hair Dresser"),
                    D(),
                    v(165, "li"),
                    _(166, "Hair Spa"),
                    D()(),
                    v(167, "p", 60)(168, "a", 61),
                    _(169, "Escolher"),
                    D()()()(),
                    v(170, "div", 56)(171, "div", 57)(172, "div")(
                      173,
                      "h3",
                      39
                    ),
                    _(174, "Manicure Pedicure"),
                    D(),
                    v(175, "p")(176, "span", 58),
                    _(177, "$34.50"),
                    D(),
                    v(178, "span", 59),
                    _(179, "/ session"),
                    D()()(),
                    v(180, "ul")(181, "li"),
                    _(182, "Manicure"),
                    D(),
                    v(183, "li"),
                    _(184, "Pedicure"),
                    D(),
                    v(185, "li"),
                    _(186, "Coloring"),
                    D(),
                    v(187, "li"),
                    _(188, "Nails"),
                    D(),
                    v(189, "li"),
                    _(190, "Nail Cut"),
                    D()(),
                    v(191, "p", 62)(192, "a", 61),
                    _(193, "Escolher"),
                    D()()()(),
                    v(194, "div", 56)(195, "div", 63)(196, "div")(
                      197,
                      "h3",
                      39
                    ),
                    _(198, "Makeup"),
                    D(),
                    v(199, "p")(200, "span", 58),
                    _(201, "$54.50"),
                    D(),
                    v(202, "span", 59),
                    _(203, "/ session"),
                    D()()(),
                    v(204, "ul")(205, "li"),
                    _(206, "Makeup"),
                    D(),
                    v(207, "li"),
                    _(208, "Professional Makeup"),
                    D(),
                    v(209, "li"),
                    _(210, "Blush On"),
                    D(),
                    v(211, "li"),
                    _(212, "Facial Massage"),
                    D(),
                    v(213, "li"),
                    _(214, "Facial Spa"),
                    D()(),
                    v(215, "p", 60)(216, "a", 61),
                    _(217, "Escolher"),
                    D()()()(),
                    v(218, "div", 56)(219, "div", 57)(220, "div")(
                      221,
                      "h3",
                      39
                    ),
                    _(222, "Body Treatment"),
                    D(),
                    v(223, "p")(224, "span", 58),
                    _(225, "$89.50"),
                    D(),
                    v(226, "span", 59),
                    _(227, "/ session"),
                    D()()(),
                    v(228, "ul")(229, "li"),
                    _(230, "Massage"),
                    D(),
                    v(231, "li"),
                    _(232, "Spa"),
                    D(),
                    v(233, "li"),
                    _(234, "Foot Spa"),
                    D(),
                    v(235, "li"),
                    _(236, "Body Spa"),
                    D(),
                    v(237, "li"),
                    _(238, "Relaxing"),
                    D()(),
                    v(239, "p", 60)(240, "a", 64),
                    _(241, "Escolher"),
                    D()()()()()()(),
                    v(242, "section")(243, "div", 65)(244, "div", 53)(
                      245,
                      "div",
                      54
                    )(246, "h2", 66),
                    _(247, "Our Prices"),
                    D()()(),
                    v(248, "div", 67)(249, "div", 68)(250, "div", 69)(
                      251,
                      "h4",
                      70
                    ),
                    _(252, "Define"),
                    D(),
                    v(253, "p"),
                    _(
                      254,
                      " Quos dolores saepe mollitia deserunt accusamus autem reprehenderit. Voluptas facere animi explicabo non quis magni recusandae. Numquam debitis pariatur omnis facere unde. Laboriosam minus amet nesciunt est. Et saepe eos maxime tempore quasi deserunt ab. "
                    ),
                    D()()(),
                    v(255, "div", 68)(256, "div", 69)(257, "h4", 70),
                    _(258, "Design"),
                    D(),
                    v(259, "p"),
                    _(
                      260,
                      " Quos dolores saepe mollitia deserunt accusamus autem reprehenderit. Voluptas facere animi explicabo non quis magni recusandae. Numquam debitis pariatur omnis facere unde. Laboriosam minus amet nesciunt est. Et saepe eos maxime tempore quasi deserunt ab. "
                    ),
                    D()()(),
                    v(261, "div", 68)(262, "div", 69)(263, "h4", 70),
                    _(264, "Build"),
                    D(),
                    v(265, "p"),
                    _(
                      266,
                      " Quos dolores saepe mollitia deserunt accusamus autem reprehenderit. Voluptas facere animi explicabo non quis magni recusandae. Numquam debitis pariatur omnis facere unde. Laboriosam minus amet nesciunt est. Et saepe eos maxime tempore quasi deserunt ab. "
                    ),
                    D()()(),
                    v(267, "div", 68)(268, "div", 69)(269, "h4", 70),
                    _(270, "Launch"),
                    D(),
                    v(271, "p"),
                    _(
                      272,
                      " Quos dolores saepe mollitia deserunt accusamus autem reprehenderit. Voluptas facere animi explicabo non quis magni recusandae. Numquam debitis pariatur omnis facere unde. Laboriosam minus amet nesciunt est. Et saepe eos maxime tempore quasi deserunt ab. "
                    ),
                    D()()()()()(),
                    v(273, "section", 71)(274, "div", 72)(275, "div", 73)(
                      276,
                      "div",
                      37
                    )(277, "span", 38),
                    _(278, "Portif\xf3lio"),
                    D(),
                    v(279, "h2", 39),
                    _(280, "Nossos Projetos"),
                    D(),
                    v(281, "p"),
                    _(
                      282,
                      "Abaixo algumas ideia tornadas realizade junto com a Maor"
                    ),
                    D()()()(),
                    v(283, "div", 74)(284, "div", 75),
                    ss(285, ON, 8, 3, "div", 76),
                    D()()()),
                    2 & n && (Zt(285), Bn("ngForOf", r.projects));
                },
                dependencies: [yc],
              })),
              e
            );
          })(),
        },
        {
          path: "about",
          component: (() => {
            class e {
              constructor() {}
              ngOnInit() {}
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)();
              }),
              (e.ɵcmp = Ut({
                type: e,
                selectors: [["app-about"]],
                decls: 11,
                vars: 0,
                consts: [
                  [
                    "data-aos",
                    "fade-up",
                    1,
                    "row",
                    "section-header",
                    "widder",
                    "aos-init",
                    "aos-animate",
                    "mx-auto",
                    "mt-5",
                    "pt-5",
                  ],
                  [1, "col-full"],
                  [1, "float-start", "pe-3"],
                  [
                    "src",
                    "https://img.freepik.com/fotos-premium/uma-pessoa-em-pe-na-frente-de-um-fundo-branco-solido_896360-8914.jpg",
                    1,
                    "cover_image",
                    "ms-auto",
                    "rounded-4",
                    2,
                    "aspect-ratio",
                    "0.75",
                    "height",
                    "38vw",
                  ],
                  [1, ""],
                  [1, "subhead"],
                  [1, "display-2"],
                ],
                template: function (n, r) {
                  1 & n &&
                    (v(0, "div", 0)(1, "div", 1)(2, "div", 2),
                    se(3, "img", 3),
                    D(),
                    v(4, "div", 4)(5, "h3", 5),
                    _(6, "Who We Are"),
                    D(),
                    v(7, "h1", 6),
                    _(
                      8,
                      " We are Sublime, a design and branding agency with partners worldwide. We design thoughtful digital experiences and beautiful brand aesthetics. "
                    ),
                    D(),
                    v(9, "p"),
                    _(
                      10,
                      "To ride the storm, to an empire of the clouds To ride the storm, they climbed aboard their silver ghost To ride the storm, to a kingdom that will come To ride the storm, and damn the rest, oblivion Royalty and dignitaries, brandy and cigars Grey lady giant of the skies, you hold them in your arms The millionth chance they laughed, to take down his majesty's craft To India they say, magic carpet float away, an October fateful day Mist is in the trees, stone sweats with the dew The morning sunrise, red before the blue Hanging at the mast, waiting for command His majesty's airship, the R101 She's the biggest vessel built by man, a giant of the skies For all you unbelievers, the Titanic fits inside Drum rolled tight, her canvas skin, silvered in the sun Never tested with the fury, with a beating yet to come The fury yet to come In the gathering gloom, a storm rising in the west The coxswain stared into the plunging weather glass We must go now, we must take our chance with fate We must go now, for a politician he can't be late The airship crew awake for thirty hours at full stretch, But the ship is in their backbone, every sinew, every inch She never flew at full speed, a trial never done Her fragile outer cover, her Achilles would become An Achilles yet to come Sailors of the sky, a hardened breed Loyal to the king, and an airship creed The engines drum, the telegraph sounds Release the cords that bind us to the ground Said the coxswain, sir, she's heavy, she'll never make this flight Said the captain, damn the cargo, we'll be on our way tonight Groundlings cheered in wonder, as she backed up from the mast Baptizing them her water, from the ballast fore and aft Now she slips into our past Fighting the wind as it rolls you Feeling the diesels that push you along Watching the channel below you Lower and lower, into the night Lights are passing below you Northern France, asleep in their beds Storm is raging around you A million to one, that's what he said Reaper standing beside her With his scythe cuts to the bone Panic to make a decision Experienced men, asleep in their graves Her cover is ripped and she's drowning Rain is flooding into the hull Bleeding to death and she's falling Lifting gas is draining away We're down lads, came a cry, bow plunging from the sky Three thousand horses silent as the ship began to die The flares to guide her path ignited at the last The empire of the clouds, just ashes in our past Just ashes at the last Here lie their dreams as I stand in the sun On the ground where they built, and the engines did run To the moon and the stars, now what have we done? Oh the dreamers may die, but the dreams live on Dreams live on Dreams live on Oh Now a shadow on a hill, the angel of the east The empire of the clouds may rest in peace And in a country churchyard, laid head to the mast Eight and Forty souls who came to die in France "
                    ),
                    D()()()());
                },
              })),
              e
            );
          })(),
        },
        { path: "project/:projectId", component: FN },
      ];
      let LN = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = An({ type: e })),
            (e.ɵinj = an({ imports: [HD.forRoot(kN), HD] })),
            e
          );
        })(),
        jN = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ut({
              type: e,
              selectors: [["app-footer"]],
              decls: 26,
              vars: 0,
              consts: [
                [1, "ftco-footer", "ftco-section", "pb-3", "pt-5"],
                [1, "container"],
                [1, "row", "mb-5"],
                [1, "col-md"],
                [1, "ftco-footer-widget"],
                [
                  1,
                  "ftco-footer-social",
                  "list-unstyled",
                  "float-md-left",
                  "float-lft",
                  "mt-1",
                ],
                ["href", "#"],
                [1, "fab", "fa-facebook-f"],
                [1, "fa", "b", "fa-instagram"],
                [1, "fab", "fa-behance"],
                [1, "home-content__button", "my-auto", "float-end", "me-5"],
                [
                  "href",
                  "#top",
                  1,
                  "smoothscroll",
                  "btn",
                  "btn-large",
                  "mb-0",
                  2,
                  "width",
                  "25rem",
                  "height",
                  "6.2rem !important",
                  "line-height",
                  "5.8rem !important",
                ],
                [
                  "href",
                  "#\n                      ",
                  1,
                  "smoothscroll",
                  "btn",
                  "btn-large",
                  "mb-0",
                  2,
                  "width",
                  "25rem",
                  "height",
                  "6.2rem !important",
                  "line-height",
                  "5.8rem !important",
                ],
                [1, "d-flex", "w-100"],
                [1, "col-md-12", "text-center"],
              ],
              template: function (n, r) {
                1 & n &&
                  (v(0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                    4,
                    "div",
                    4
                  )(
                    5,
                    "ul",
                    5
                  )(6, "li")(7, "a", 6),
                  se(8, "span", 7),
                  D()(),
                  v(9, "li")(10, "a", 6),
                  se(11, "span", 8),
                  D()(),
                  v(12, "li")(13, "a", 6),
                  se(14, "span", 9),
                  D()()()()(),
                  v(15, "div", 3)(16, "div", 10)(17, "a", 11),
                  _(18, " Para o topo "),
                  D(),
                  v(19, "a", 12),
                  _(20, " Fazer or\xe7amento "),
                  D()()()(),
                  v(21, "div", 13)(22, "div", 14)(23, "p"),
                  _(24, " Copyright \xa9 "),
                  _(25, " Todos os direitos reservados "),
                  D()()()()());
              },
            })),
            e
          );
        })();
      function VN(e, t) {
        1 & e && (v(0, "div", 7)(1, "a", 8), _(2, "Voltar"), D()());
      }
      let $N = (() => {
          class e {
            constructor(n) {
              (this.router = n), (this.isHomePage = !0);
            }
            ngOnInit() {
              this.router.events.subscribe((n) => {
                n instanceof bn &&
                  (this.isHomePage = "/home" == this.router.url);
              });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Se));
            }),
            (e.ɵcmp = Ut({
              type: e,
              selectors: [["app-header"]],
              decls: 10,
              vars: 1,
              consts: [
                ["id", "preloader"],
                ["id", "loader", 1, "dots-jump"],
                [
                  1,
                  "s-header",
                  "d-flex",
                  "justify-content-between",
                  "px-5",
                  "pt-2",
                ],
                [1, "header-logo", "col"],
                ["href", "index.html", 1, "site-logo", "col-auto"],
                ["src", "/portfolio/assets/img/logo.svg", "alt", "Homepage"],
                ["class", "col-auto", 4, "ngIf"],
                [1, "col-auto"],
                [
                  "href",
                  "index.html",
                  "title",
                  "back",
                  1,
                  "smoothscroll",
                  "subhead",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  (v(0, "div", 0)(1, "div", 1),
                  se(2, "div")(3, "div")(4, "div"),
                  D()(),
                  v(5, "header", 2)(6, "div", 3)(7, "a", 4),
                  se(8, "img", 5),
                  D()(),
                  ss(9, VN, 3, 0, "div", 6),
                  D()),
                  2 & n && (Zt(9), Bn("ngIf", !r.isHomePage));
              },
              dependencies: [rv],
            })),
            e
          );
        })(),
        BN = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ut({
              type: e,
              selectors: [["app-root"]],
              decls: 3,
              vars: 0,
              template: function (n, r) {
                1 & n &&
                  se(0, "app-header")(1, "router-outlet")(2, "app-footer");
              },
              dependencies: [Zc, jN, $N],
            })),
            e
          );
        })(),
        HN = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = An({ type: e, bootstrap: [BN] })),
            (e.ɵinj = an({ imports: [z1, LN] })),
            e
          );
        })();
      (function nT() {
        Ay = !1;
      })(),
        U1()
          .bootstrapModule(HN)
          .catch((e) => console.error(e));
    },
  },
  (te) => {
    te((te.s = 407));
  },
]);
