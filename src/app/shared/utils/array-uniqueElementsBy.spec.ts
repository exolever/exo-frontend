import { uniqueElementsBy } from '@shared/utils/array-uniqueElementsBy';

describe('Util: arrayUniqueElements', () => {
  it('Should return all uniques elements in array', () => {
    const array = [
      {pk: 0, name: 'Jina'},
      {pk: 1, name: 'Tina'},
      {pk: 2, name: 'Lina'},
      {pk: 0, name: 'Mina'},
    ];

    expect(uniqueElementsBy(array, (a, b) => a.pk === b.pk)).toEqual(
      [
        {pk: 0, name: 'Jina'},
        {pk: 1, name: 'Tina'},
        {pk: 2, name: 'Lina'}
      ]
    );
  });

  it('Should return all uniques elements filtering by name', () => {
    const array = [
      {name: 'Jose', job: 'design'},
      {name: 'Jose', job: 'backend'},
      {name: 'Marga', job: 'finances'}
    ];

    expect(uniqueElementsBy(array, (a, b) => a.name === b.name)).toEqual(
      [
        {name: 'Jose', job: 'design'},
        {name: 'Marga', job: 'finances'}
      ]
    );
  });
});
