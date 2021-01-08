declare const o: any;
declare let x: any;

o?.foo?.bar.baz?.()?.();

o ?? 1;
o.foo ?? 1;
o?.foo ?? o?.bar;

o === null || o === void 0 ? true : false;
o !== null && o !== void 0 ? true : false;

// should not be touched
o === null && o === void 0 ? false : false;
o !== null || o !== void 0 ? true : true;
o === null && o !== void 0 ? true : false;
(x = o) === null || o === void 0 ? true : false;
(o.foo) === null || o === void 0 ? true : false;
o.bar === null || o.bar === void 0 ? true : false;
