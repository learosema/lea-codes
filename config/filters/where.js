/** Returns all entries from the given array that match the specified key:value pair. */
export default (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter((item) => {
    const parts = keyPath.split('.');
    const key = parts.pop();
    const obj = parts.reduce((o, k) => (o ? o[k] : undefined), item);
    return obj && obj[key] === value;
  });
