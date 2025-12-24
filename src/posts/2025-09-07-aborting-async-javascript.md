---
title: Aborting async JavaScript
description: Mini-Tutorial about how to abort asynchronous JavaScript
tags: 
  - javascript
  - async
date: 2025-09-07
updates: 
  - 2025-12-24 add the start/abort buttons in the example code to make it clear the signal is inside the AbortController
---
This is a follow-up post about something I wrote on dev.to, 5 years ago:
[Aborting a fetch request](https://dev.to/learosema/aborting-a-fetch-request-4pmb).

As I mentioned, aborting is not too intuitive. When using fetch, you can
provide a `signal` in the request options, which can then be used to abort
operations.

This can not only be used inside the fetch API but inside everything asynchronous.

## Wait, Vanilla JavaScript has signals?

Yes. But not the Angular kind. It's solely for aborting
async operations and that's why it's called [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

It works like this: you create a new [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

The controller exposes an `abort` method and a `signal` property.
The `signal` can be used to listen on `abort` events, via
`signal.addEventListener`.

## Code Example

```js
let abortController = null;
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
  if (! abortController) return;
  abortController.abort();
  abortController = null;
});

runButton.addEventListener("click", () => {
  
  if (abortController) return;
  abortController = new AbortController();
  counter = 1;
  
  // The abort signal is a property of 
  // the AbortController, which we pass to the 
  // async loop function. 
  // We could even "await" it here, but as we
  // don't do anything further afterwards, it can be a 
  // fire and forget.
  const abortSignal = abortController.signal;
  loop(0, abortSignal);
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

runButton2.addEventListener("click", () => {
  if (abortController2) return;
  abortController2 = new AbortController();
  counter2 = 1;
  loop2(0, abortController2.signal);
})

abortButton2.addEventListener("click", () => {
  if (! abortController2) return;
  abortController2.abort();
  abortController2 = null;
});

```

Check the full demo on [CodePen](https://codepen.io/learosema/pen/ByoMVzx?editors=0011).

## Sources

- [DOM spec: aborting ongoing activities](https://dom.spec.whatwg.org/#aborting-ongoing-activities)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
