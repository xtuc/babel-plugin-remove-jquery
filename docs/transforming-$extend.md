---
id: transforming-$extend
title: Transforming $.extend
---

## 1 step: find a `CallExpression` node

```js
visitor: {
  CallExpression(path) {
    // …
  }
}
```

## 2 step: ensure that the `CallExpression` is `$.extend`

Input:

```js
$.extend({}, objA, objB);
^ ^^^^^^
```

Visitor:

```js
const { callee, arguments: args } = path.node;

if (!t.isMemberExpression(callee)) {
  return;
}

if (
  callee.object.name === "$" &&
  callee.property.name === "extend"
) {
  // yes …
}
```

## 3 step: define the `extend` helper

In order to actually extend two objects we are going to inject a helper function called `extend` (and renamed to avoid an identifier collision).

The `@babel/template` package provide a way to manage code snippets as a template.

Visitor:

```js
const extendHelper = defineHelper(`
  var ID = function(out) {
    // …
    return out;
  };
`);
```

In the template we will renamed the `ID` identifier, you can have the processed template by running: `extendHelper({ ID: … });`.

## 4 step: injecting the `extend` helper

Diff:

```diff
+var _extend = function (out) {
+  // …
+  return out;
+};

$.extend({}, objA, objB);
```

Visitor:

```js
// Generate a safe identifier by looking to the current scope
const helperId = path.scope.generateUidIdentifier("extend");

// Process the template
const helper = extendHelper({ID: helperId});

// Inject it into the scope (before the call)
path.insertBefore([helper]);
```

## 4 step: rename `$.extend` to call our helper

Now that we have our helper in the scope, we need to change the call to `$.extend` to actually use it.

For simplicity we can override the entire `callee` object with an identifier.

Diff:

```diff
var _extend = function (out) {
  // …
  return out;
};

-$.extend({}, objA, objB);
+_extend({}, objA, objB);
```

Visitor:

```js
path.node.callee = helperId;
```
