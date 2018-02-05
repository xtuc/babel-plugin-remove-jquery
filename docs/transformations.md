---
id: transformations
title: Transformations
---

## Remove `$.extend`

### Input

```js
$.extend({}, objA, objB);
```

### Ouput

```js
var _extend = ...;

_extend({}, objA, objB);
```

## Remove `$.now`

Click [here to see how this transformation works](transforming-$now.md).

### Input

```js
$.now();
```

### Ouput

```js
Date.now();
```

## Remove `$.each`

### Input

```js
$.each(array, function(i, item) {
  console.log(i, item);
});
```

### Ouput

```js
array.forEach(function (item, i) {
  console.log(i, item);
});
```
