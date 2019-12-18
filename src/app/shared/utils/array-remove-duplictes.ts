export function removeDuplicatesFromArray( arrayToClean: Array<any> ): Array<any> {
  return arrayToClean.sort().filter((item, pos, ary) => {
    return !pos || item !== ary[pos - 1];
  });
}
