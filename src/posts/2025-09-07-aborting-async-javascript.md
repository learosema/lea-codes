---
title: Aborting async JavaScript
description: Mini-Tutorial about how to abort asynchronous JavaScript
tags: 
  - javascript
  - async
date: 2025-09-07
---
This is a follow-up post about something I wrote on dev.to, 5 years ago:
[Aborting a fetch request](https://dev.to/learosema/aborting-a-fetch-request-4pmb).

As I mentioned, aborting is not too intuitive. When using fetch, you can
provide a `signal` in the request options, which can then be used to abort
operations.

This can not only be used inside the fetch API but inside everything asynchronous.

## Wait, Vanilla JavaScript has signals?

Yes. But not the Angular kind. It's solely for aborting
async operations and that's why it's called `AbortSignal`.

It works like this: you create a new `AbortController`.

The controller exposes an `abort` method and a `signal`.
The `signal` can be used to listen on `abort` events, via
`signal.addEventListener`.

## Code Example

```js
const abortController = new AbortController();
let counter = 1;

async function loop(t = 0, signal) {
  const timeout = setTimeout((t) => loop(t, signal), 1000);

  $counter.innerHTML = counter;
  counter++;
  signal.addEventListener("abort", () => {
    clearTimeout(timeout);
    $counter.innerHTML = "aborted :)";
  });
}

abortButton.addEventListener("click", () => {
  abortController.abort();
});
```

## Nested asynchronous functions

When you have nested asynchronous functions, don't forget to pass the signal down.

```js
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timerId)
      reject()
    })
  })
}

async function incrementTripleTimes(signal) {
  $counter2.innerHTML = counter2;
  await wait(1000, signal)
  $counter2.innerHTML = ++counter2;
  await wait(1000, signal)
  $counter2.innerHTML = ++counter2;
  await wait(1000, signal)
  $counter2.innerHTML = ++counter2;
}

async function loop2(t = 0, signal) {
  // uncomment below and see what happens
  // signal = null
  signal?.addEventListener("abort", () => {
    $counter2.innerHTML = "aborted :)";
  });

  await incrementTripleTimes(signal);
  await incrementTripleTimes(signal);
  await incrementTripleTimes(signal);
  
  console.log('restarting loop')
  window.setTimeout((t) => loop2(t, signal), 0);
}
```

Check the full demo on [CodePen](https://codepen.io/learosema/pen/ByoMVzx?editors=0011).
