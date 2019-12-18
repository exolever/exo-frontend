import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { configTestBed } from '@testing/test.common.spec';
import { JoinPipe } from '@shared/pipes/join.pipe';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';

describe ('JoinPipe', () => {
  let pipe: JoinPipe;
  let translateSv: TranslateService;
  const mockArray = [ 'one', 'two', 'three' ];
  const mockTwoItems = [ 'one', 'two' ];
  const mockOneItem = [ 'one' ];
  const mockObj = { one: 'one', two: 'two', three: 'three' };

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    translateSv = TestBed.get(TranslateService);
    pipe = new JoinPipe(translateSv);
  });

  it('should join an array with commas', () => {
    expect( pipe.transform( mockArray )).toEqual( 'one, two, three' );
  });

  it( 'should return the input unchanged when it is not an array', () => {
    expect( pipe.transform( mockObj )).toBe( mockObj );
  });

  it( 'should join with the language connector when "last" parameter is set to true', () => {
    expect(pipe.transform( mockArray, undefined, true )).toBe('one, two and three');
    expect(pipe.transform( mockTwoItems, undefined, true )).toBe('one and two');
  });

  it( 'should return the single item of the array without joining', () => {
    expect(pipe.transform( mockOneItem, undefined, true )).toBe('one');
  });

});
