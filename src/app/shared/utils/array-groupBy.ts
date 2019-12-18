/**
 * Group the elements of an array based on the given function or property.
 *
 * Use Array.map to map the values of an array to a function or property name.
 * Use Array.reduce to create an object, where the keys are produced from the mapped results.
 *
 * Example: groupBy([2.1, 3.3, 3.7], Math.floor); // {2: [2.1], 3: [3.3, 3.7]}
 * @param arr
 * @param fn
 */
export const groupBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});
