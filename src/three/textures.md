---
title: Textures
description: Loading textures in Three.js
tags:
  - textures
---

To load textures, Three.js provides a [`TextureLoader`](https://threejs.org/docs/index.html#api/en/loaders/TextureLoader). Optionally, you can use [`LoadingManager`](https://threejs.org/docs/index.html#api/en/loaders/managers/LoadingManager) to keep track of the loading progress of the files.

```js
const loadingManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadingManager);

const earthTexture = loader.load('earth.jpg');
```

You can then use the texture in your material:

```js
// Setup a geometry
const geometry = new THREE.SphereGeometry(1, 32, 16);

// Setup a material
const material = new THREE.MeshStandardMaterial({
  roughness: 1,
  metalness: 0,
  map: eathTexture,
});

// Setup a mesh with geometry + material
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```
