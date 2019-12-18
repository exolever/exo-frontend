import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configTestBed } from '@testing/test.common.spec';
import { BrowserGuard } from '@core/guards/browser.guard';
import { WindowRef } from '@core/services';
import { RouterStub } from '@testing/stubs/router-stubs';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

describe('Guard: BrowserGuard', () => {
  let browserGuard: BrowserGuard;
  let w: any;

  const moduleDef: TestModuleMetadata = {
    imports: [ HttpClientTestingModule, RouterTestingModule ],
    providers: [
      BrowserGuard,
      WindowRef,
      URL_SERVICE_STUB_PROVIDER,
      { provide: ActivatedRouteSnapshot, useValue: {} },
      { provide: Router, useClass: RouterStub },
    ]
  };
  configTestBed(moduleDef, false);

  beforeEach(() => {
    browserGuard = TestBed.get( BrowserGuard );
    w = TestBed.get( WindowRef );
  });

  it ( 'should generate guard', () => {
    expect ( browserGuard ).toBeDefined();
    expect ( browserGuard ).toBeTruthy();
  });

  it('should have flexbox available in modern browsers', () => {
    w.nativeWindow.Modernizr.flexbox = true;

    expect( browserGuard.canActivateChild() ).toBe( true );
  });

  it('should detect lack of flexbox support in non compliant browsers', () => {
    w.nativeWindow.Modernizr.flexbox = false;

    expect( browserGuard.canActivateChild() ).toBe( false );
  });

  it ( 'should return true as long as all constraints are true', () => {
    const modernizr = w.nativeWindow.Modernizr;

    Object.keys( modernizr ).forEach( k => {
      modernizr[ k ] = true;
    });

    expect( browserGuard.canActivateChild() ).toBe( true );
  });
});
