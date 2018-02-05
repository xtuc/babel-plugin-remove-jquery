---
id: transforming-$each
title: Transforming $.each
---

## 1 step: find a `CallExpression` node

```js
visitor: {
  CallExpression(path) {
    // …
  }
}
```

## 2 step: ensure that the CallExpression is `$.each`


```js
const { callee, arguments: args } = path.node;

if (!t.isMemberExpression(callee)) {
  return;
}

if (
  callee.object.name === "$" &&
  callee.property.name === "each"
) {
  // yes …
}
```

## 3 step: remove the first argument (`array`)

For simplicity we can directly change the arguments.

Make sure to conserve the name of the first argument before removing it.

```js
// Keep name of the first argument
const arrayArgName = args[0];

path.node.arguments = args.slice(1);
```

## 4 step: Rename `$.each` to `array.forEach`

```js
callee.object = arrayArgName;
callee.property = t.identifier("forEach");
```

## 5 step: inverse the argument order

For simplicity we can directly mutate the parameters array.

```js
args[1].params.reverse();
```
