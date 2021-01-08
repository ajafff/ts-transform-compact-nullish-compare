var _a, _b, _c, _d, _e, _f;
(_d = (_c = (_a = o == null ? void 0 : o.foo) == null ? void 0 : (_b = _a.bar).baz) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d();
o != null ? o : 1;
(_e = o.foo) != null ? _e : 1;
(_f = o == null ? void 0 : o.foo) != null ? _f : o == null ? void 0 : o.bar;
o == null ? true : false;
o != null ? true : false;
// should not be touched
o === null && o === void 0 ? false : false;
o !== null || o !== void 0 ? true : true;
o === null && o !== void 0 ? true : false;
(x = o) === null || o === void 0 ? true : false;
(o.foo) === null || o === void 0 ? true : false;
o.bar === null || o.bar === void 0 ? true : false;
