---
id: transformation-$each
title: Transformation $.each
---

## Input

```js
$.each(array, function(i, item) {
  console.log(i, item);
});
```

## Ouput

```js
array.forEach(function (item, i) {
  console.log(i, item);
});
```
