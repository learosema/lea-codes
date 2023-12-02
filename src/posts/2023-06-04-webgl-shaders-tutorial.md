---
title: WebGL Shaders Tutorial
description: A short tutorial on WebGL and Shaders
date: 2023-06-04
tags:
  - javascript
  - webgl
  - glsl
prefetches:
  - href: https://cdn.jsdelivr.net/npm/shader-art@1.3.0/dist/index.esm.js
---

In this article, I would like to give a short introduction on WebGL, a low level graphics engine running in the browser.

A common misconception is that people often think of WebGL as a 3D engine, but it is in fact a rasterization engine for drawing points, lines and triangles.

This can be used as building bricks for creating a 3D engine. Actually there are a number of 3D engines implemented on top of WebGL, like [three.js](https://threejs.org) or [babylon.js](https://babylonjs.com).

## WebGL and OpenGL

WebGL is based on OpenGL ES, providing a thin JavaScript layer over the OpenGL ES API. It comes in different versions, basically WebGL 1 (based on OpenGL ES 2.0) and WebGL 2 (based on OpenGL ES 3.0).

On Safari 14 and older or Internet Explorer, only WebGL 1 is available. WebGL 2 removes some limitations of WebGL 1.

The tech people said to me "you don't need to support WebGL 1 anymore" but Lea is more into making things as inclusive as possible and so I think I should stick to WebGL 1 as I don't really touch the features of WebGL 2 in this article anyway. Also, there is a great in-depth site on [WebGL 2](https://webgl2fundamentals.org). Besides that, there also is a great site on [WebGL 1](https://webglfundamentals.org) which goes more in-depth than this article.

## It runs on the GPU

WebGL is a low-level graphics library, which provides an API for running programs on the GPU.

- Programs consist of a pair of functions, called shaders.
- Shaders are written in a C-like language, called GLSL (GL Shader language).
- There is a Vertex Shader and a Fragment Shader.
- Most of the WebGL API is about setting up the state for the shaders and passing data from JavaScript to WebGL

## Vertex Shaders

The job of the Vertex shader is to receive data from a buffer and to calculate vertex positions based on that data.
Based on the positions it returns, WebGL can then rasterize certain primitives, like points, lines or triangles.

You can imagine the vertex shader as a function that takes a data record and returns a position. A common use-case of the vertex shader is to take a 3D coordinate and apply a perspective projection, for example.

## Fragment shaders

When rasterizing these shapes (filling triangles with pixels), the fragment shader is run. This is done in a highly parallelized manner.
For each fragment(=pixel) of the shape, the fragment shader is run in parallel.

The fragment shader is like a function that takes a number of arguments like the fragment position (where inside the shape am I?) and returns a color based on that.

It works a lot like [tixy.land](https://tixy.land), where you have a function that is executed for each dot in a dot matrix, taking parameters like the x,y coordinate, the time value and the pixel index and return a value representing the dot size and color in a dot matrix.

## Drawing a triangle

One of the most straightforward WebGL programs is drawing a triangle using a constant color.

We'll provide buffer data for 3 points, and the vertex shader will be doing nothing else but directly returning the data without any further calculation. For each record in the data, the vertex shader is run to calculate a vertex position, spanning up a triangle.

There are several draw modes available in WebGL: shall we draw points, lines, triangles or a strip of triangles? We'll focus on triangles in ths article.

### Code for the Vertex Shader

```glsl
precision highp float;
attribute vec4 position;

void main() {
  gl_Position = position;
}
```

The vertex shader takes a record from buffers through an `attribute`. In this case, we are only using a `position` attribute, which is directly passed to the global `gl_Position`.

The coordinates passed to `gl_Position` are like in a carthesian coordinate system with `(0, 0)` in the center, `(-1, -1)` on the bottom left corner and `(1, 1)` on the top right corner.

### Code for the Fragment Shader

```glsl
precision highp float;

void main() {
  // return red. 100% red, 0% green, 0% blue, 100% alpha
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
```

The fragment shader sets the global `gl_FragColor` to a constant vec4 value. The components of the vec4 vector represent red, green, blue and alpha values.

Another global variable available is `gl_FragCoord`, a vec2 value pointing to the current coordinate of the pixel being processed.

### GL Shader Language

As you may have noticed, glsl looks like a C-like programming language. It is. Most primitive types as in C are available (most importantly int, float, double). In addition to that, we have additional types for vectors (`vec2`, `vec3`, `vec4`, or their integer companions `ivec2`, `ivec3`, `ivec4`) and matrices (`mat2`, `mat3`, `mat4`, ...). One nice perk of GLSL is: things like matrix multiplication is built-in, just use the `*` operator.

On my website, I have a little GLSL overview which should help you getting started:
[https://lea.codes/webgl/glsl-overview/](https://lea.codes/webgl/glsl-overview/)

In WebGL 1, you may face the limitation that the break condition of for-loops only work when a constant condition is used, as in `for (int i = 0; i < 10; i++) {}`. Using another dynamic variable for the break condition (as in `i < j`) is not allowed. This limitation is removed in WebGL 2.

### The full working demo

Here's the full code. I'm using a [shader-art](https://github.com/shader-art/shader-art) web component to abstract away WebGL a bit so we can focus on the shaders.

{% demo "shader-1" %}

## Passing data from the vertex shader to the fragment shader

In the next demo, we'll draw two triangles filling the whole viewport of the canvas. Alongside with the position buffer, we'll also provide a UV buffer, which is often used for texture coordinates. So, the top left corner is at `(0, 0)` and the bottom right is at `(1, 1)`.

The UV coordinates are received in the vertex shader as a 2D, vector: `attribute vec2 uv`. These can be passed over to the fragment shader through a `varying` variable. A common convention is to prefix varying variables with `v`, like `vUV`.

Additionally, these values are not only just passed over from the vertex to the fragment shader, but also interpolated between the edges of the triangle shapes.

This way, we can create a gradient. In the example, the fragment shader calculates a color based on the interpolated UV coordinates, using red as a constant 100% value, green as the `uv.x` value, blue as the `uv.y` value.

{% demo "shader-2" %}

In this case, it would also be possible to calculate the uv coordinates from the `position`, but that's only trivial when dealing with a rectangle. With having additional UV coordinates, we could shift the positions in the vertex shader a bit (in a way there are no right angles anymore, imagine a perspective projection) and the uv vector still provides us with correct values.

## Passing data from JavaScript to shaders

You can use `uniform` variables to pass data from JavaScript to your shaders. The `<shader-art>` web component passes a `uniform vec2 resolution` uniform and a `uniform float time` to your shaders which you can use both in the vertex shader as well as in the fragment shader. The `resolution` uniform holds a 2d vector containing the absolute pixel resolution of the canvas and is useful for aspect ratio correction, eg. whenever you want to draw perfect squares and circles within your shaders. The `time` uniform holds the amount of microseconds passed and can be used for simple animations.

With the time value, you can start to get create animations similar to in [tixy.land](https://tixy.land).

The demo below shows an animation, feeding a noise function with xy-coordinates and a time value, with the noise function is being combination of sine and cosine functions. This already creates a beautiful effect.

{% demo "shader-3" %}

## Migrating to WebGL2

From the shader-side, it's basically this:

- Prefix your shaders with `#version 300 es`
- `attribute` variables in the vertex shader are declared as `in`, eg. `in vec4 position;`
- `varying` variables in the vertex shader are declared as `out` instead, eg. `out vec2 vUv;`
- `varying` variables in the fragment shader are declared as `in` instead, eg. `in vec2 vUv;`
- there's no `gl_FragColor` anymore in the fragment shader, declare an `out vec4 fragColor;` and use that (name it as you like)

From the JavaScript-side, you will call canvas.getContext('webgl2') instead of canvas.getContext('webgl') and you will receive a `WebGL2RenderingContext` which is mainly backwards-compatible with `WebGLRenderingContext`. The `<shader-art>` component takes care of that for you as soon as it sees the `#version 300 es` pragma.

## Where to go from here

Feel free to take the code and play around with it. All code is licensed under the MIT license (see [LICENSE](https://github.com/lea-lgbt/blog/blob/main/LICENSE)).

You are not tied to the `<shader-art>` web component I created for educational purposes. You can re-use this knowledge in any webgl framework like THREE.js, PIXI.js, P5.js and more. I've created a repository with a couple of webgl templates using different frameworks: [https://github.com/learosema/webgl-templates](https://github.com/learosema/webgl-templates).

If you like to learn all the things about shaders, have a look at [https://thebookofshaders.com/](https://thebookofshaders.com/).
Also, check out [https://iquilezles.org/](https://iquilezles.org/).

If you love to learn all the details about WebGL, have a look at [webglfundamentals.org](https://webglfundamentals.org). Also, I shared a lot of information about webgl on my personal website, [lea.codes](https://lea.codes).

Also, a definite recommend is the course [threejs-journey.com](https://threejs-journey.com/) by Bruno Simon, especially if you prefer not to dive too deep into WebGL internals and shaders and focus on working with a fully fledged 3D engine and doing content creation.
