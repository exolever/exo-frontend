import { groupBy } from '@shared/utils/array-groupBy';

describe('Util: arrayGroupBy', () => {
  it('Should return dictionary by pk', () => {
    const array = [
      { pk: 55, value: 'Random'},
      { pk: 2, value: 'Random value 2'},
      { pk: 3, value: 'Random value 3'},
      { pk: 55, value: 'Random value 1'},
    ];

    expect(groupBy(array, 'pk')).toEqual(
      {
        55: [Object({pk: 55, value: 'Random'}), Object({pk: 55, value: 'Random value 1'})],
        2: [Object({pk: 2, value: 'Random value 2'})],
        3: [Object({pk: 3, value: 'Random value 3'})]
      }
    );
  });

  it('Should order by string length', () => {
    const array = ['one', 'sun', 'four', 'more', 'three'];
    expect(groupBy(array, 'length')).toEqual(
      {
        3: ['one', 'sun'],
        4: ['four', 'more'],
        5: ['three']
      }
    );
  });
});
