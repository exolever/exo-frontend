export function objectsAreEqual(object1, object2): boolean {
  let hasSameInformation: boolean;
  hasSameInformation = Object.keys(object1).length === Object.keys(object2).length;
  if (hasSameInformation) {
    hasSameInformation = Object.keys(object1).every(key => key in object2 && object1[key] === object2[key]);
  }
  return hasSameInformation;
}
