import * as faker from 'faker';
import {arrayEquals} from '@shared/utils/array-equals';

describe( 'Util: arrayEquals', () => {

  it ( 'should return true when equal arrays', () => {
    const arr1 = [ faker.random.arrayElement(), faker.random.arrayElement(), faker.random.arrayElement() ];
    const arr2 = arr1;

    expect( arrayEquals( arr1, arr2 ) ).toBe( true );
  });

  it ( 'should be false when different strings', () => {
    const arr1 = [ 'a', 3, 'c' ];
    const arr2 = [ 'b', 3, 'c' ];

    expect( arrayEquals( arr1, arr2 ) ).toBe( false );
  });

  it ( 'should be false when different length', () => {
    const arr1 = [ 'a', 3, 'c' ];
    const arr2 = [ 'a', 3 ];

    expect( arrayEquals( arr1, arr2 ) ).toBe( false );
  });

  it ( 'should be false when undefined', () => {
    const arr1 = [ 'a', 3, 'c' ];

    expect( arrayEquals( arr1, undefined ) ).toBe( false );
  });

  it ( 'should be able to compare array of arrays through recursive iterations', () => {
    let arr1 = [[ 'a', 3, 'c' ], 4];
    let arr2 = [[ 'a', 3, 'c' ], 4];

    expect( arrayEquals( arr1, arr2 ) ).toBe( true );

    arr1 = [[ 'a', 3, 'c' ], 4];
    arr2 = [[ 1, 3, 'c' ], 4];

    expect( arrayEquals( arr1, arr2 ) ).toBe( false );
  });

  it ( 'should be able to compare objects', () => {
    let arr1 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];
    let arr2 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];

    expect( arrayEquals( arr1, arr2 ) ).toBe( true );

    arr1 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];
    arr2 = [[ 'a', 3, 'c' ], { a: 1, b: 5, c: 3 }];

    expect( arrayEquals( arr1, arr2 ) ).toBe( false );

    arr1 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];
    const arr3 = [[ 'a', 3, 'c' ], { a: 1, b: 5 }];

    expect( arrayEquals( arr1, arr3 ) ).toBe( false );

    arr1 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];
    const arr4 = [[ 'a', 3, 'c' ], { a: 1, b: null }];

    expect( arrayEquals( arr1, arr4 ) ).toBe( false );

    arr1 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];
    const arr5 = [[ 'a', 3, 'c' ], { a: 1, b: '3' }];

    expect( arrayEquals( arr1, arr5 ) ).toBe( false );

    arr1 = [[ 'a', 3, 'c' ], { a: 1, b: 2, c: 3 }];
    const arr6 = [[ 'a', 3, 'c' ], { a: 1 }];

    expect( arrayEquals( arr1, arr6 ) ).toBe( false );
  });

});
