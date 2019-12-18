/**
 * Returns all unique values of an array, based on a provided comparator function.
 * Example: uniqueElementsBy(
 * [{ pk: 0, value: 'a' },{ pk: 1, value: 'b' },{ pk: 2, value: 'c' },{ pk: 1, value: 'd' }, { pk: 0, value: 'e' }],
 * (a, b) => a.id == b.id ); // [ { pk: 0, value: 'a' }, { pk: 1, value: 'b' }, { pk: 2, value: 'c' }]
 * @param arr
 * @param fn
 */
export const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) {
      acc.push(v);
    }
    return acc;
  }, []);
