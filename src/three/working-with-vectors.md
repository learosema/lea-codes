---
title: Working with Vectors
description: Working with Vectors in Three.js
---

Three.js provides several classes for vector arithmetics. One thing to keep in mind is that the methods like `add` modify the current object instance and won't create a new instance.

```js
// Initialization:
const a = new THREE.Vector2(1, 2);
const b = new THREE.Vector3(2, 2);
const c = new THREE.Vector2(); // default constructor arguments are (0, 0)

// d = a + b;
const d = new THREE.Vector2();
d.copy(a); // copy the values of a into d
d.add(b); // add b to d

const cd = c.distanceTo(d);

// Important to note:
// add mutates the values of the current vector
```

### See documentation

- [Vector2](https://threejs.org/docs/index.html#api/en/math/Vector2)
- [Vector3](https://threejs.org/docs/index.html#api/en/math/Vector3)
