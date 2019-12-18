import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { WindowRef } from '@core/services/browser-api/window-ref.service';
import { configTestBed } from '@testing/test.common.spec';

describe( 'Service: WindowRef', () => {
  let w: WindowRef;

  const moduleDef: TestModuleMetadata = {
    providers: [ WindowRef ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    w = TestBed.get( WindowRef );
  });

  it ( 'should create', () => {
    expect( w ).toBeDefined();
    expect( w ).toBeTruthy();
  });

  it ( 'should capture browser global namespace', () => {
    const nativeWindow = window;

    expect( w.nativeWindow ).toBe( nativeWindow );
  });
});
