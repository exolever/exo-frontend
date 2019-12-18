import { objectsAreEqual } from './object.helper';

describe('Helper for objects', () => {
  it('check if two objects are equal', () => {
    expect(objectsAreEqual({ 'element': 1, 'element2': 2 }, { 'element': 1, 'element2': 2 })).toBeTruthy();
    expect(objectsAreEqual(
      { 'element': 'item-1', 'element2': 'item-2' }, { 'element': 'item-1', 'element2': 'item-2' }
    )).toBeTruthy();
    expect(objectsAreEqual({ 'element': 1, 'element2': 2 }, { 'element': 1 })).toBeFalsy();
    expect(objectsAreEqual(
      { 'element': 'item-1', 'element2': 'item-2' }, { 'element2': 'item-1', 'element1': 'item-2' }
    )).toBeFalsy();
    expect(objectsAreEqual(
      { 'element': 'item-1', 'element2': 'item-2' }, { 'element': 'item-1', 'element3': 'item-2' }
    )).toBeFalsy();
  });
});
