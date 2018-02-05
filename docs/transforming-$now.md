---
id: transforming-$now
title: Transforming $.now
---

## 1 step: find a `CallExpression` node

Visitor:

```js
visitor: {
  CallExpression(path) {
    // …
  }
}
```

## 2 step: ensure that the `CallExpression` is `$.now`

Input:

```js
/*
  $.now();
  ^ ^^^
*/
```

Visitor:

```js
const { callee, arguments: args } = path.node;

if (!t.isMemberExpression(callee)) {
  return;
}

if (
  callee.object.name === "$" &&
  callee.property.name === "now"
) {
  // yes …
}
```

## 3 step: transforming `$.now` into `Date.now`

For simplicity we can directly mutate the `callee` object.

Diff:

```diff
-$.now();
+Date.now();
```

Visitor:

```js
// Rename $.now to Date.now
callee.object = t.identifier("Date");
```

