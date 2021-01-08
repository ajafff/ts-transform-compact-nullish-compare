# ts-transform-compact-nullish-compare

TypeScript transformer to make transpiled output of optional chaining and nullish coalescing less verbose.

## Why

TypeScript's emit for optional chaining and nullish coalescing is very verbose, but as correct as it can be:

```ts
foo?.bar;
foo ?? baz;

// is transpiled to
foo === null || foo === void 0 ? void 0 : foo.bar;
foo !== null && foo !== void 0 ? foo : baz;

// this transform converts it to the following more compact representation
foo == null ? void 0 : foo.bar;
foo != null ? foo : baz;
```

If your code doesn't use optional chaining or nullish coalescing on `document.all` you don't need the extra correctness provided by TypeScript's output.

### Use cases

#### Minification

This reduces the size of the transpiled code. Depending on your program the reduction can be significant.
Shipping less code means less network traffic, less parsing time and happier users.
Execution time is probably not affected by this change.

#### Code coverage

The additional branches in the transpiled code increase the "Branches" count in code coverage reports.
This transform removes one of those branches.

## Usage with `ttypescript`

I wrote this transformer for use with [`ttypescript`](https://github.com/cevek/ttypescript).

You can configure it in your `tsconfig.json`:

```js
{
  "compilerOptions": {
    "plugins": [
      { "transform": "ts-transform-compact-nullish-compare", "after": true }
    ]
  }
}
```

Note that you can use any `"type"` for the transformer: the default is `"type": "program"`, but it also works with `"type": "raw"` for example.

Afterwards you run `ttsc` as you would run `tsc`.

## Usage with `ts-loader`, `rollup`, and TypeScript's API

This package exports the necessary factory function to create the transformer. You can use this function to plug this transformer in any major TypeScript compilation pipeline.
Please refer to the API documentation of the tool you are using. Alternatively you can use [`ttypescript`](https://github.com/cevek/ttypescript) in most tools.
