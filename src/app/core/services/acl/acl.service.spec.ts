import { Component } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserServiceStub } from '@core/services/stubs';
import { configTestBed } from '@testing/test.common.spec';

import { AclService } from './acl.service';
import { UserService } from '../user/user.service';
import { UrlService } from '../api/resolve';

@Component({
  selector: 'app-test',
  template: ''
})
class StubAppTestComponent {}

describe('Service: Acl', () => {
  let service: AclService;

  const moduleDef: TestModuleMetadata = {
    imports: [ RouterTestingModule, HttpClientTestingModule ],
    declarations: [ StubAppTestComponent ],
    providers: [
      AclService,
      { provide: UserService, useClass: UserServiceStub },
      { provide: UrlService, useValue: {} },
      { provide: 'canActivate', useValue: ( route: ActivatedRouteSnapshot ) => true }
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    service = TestBed.get( AclService );
  });

  it('should create service', () => {
    expect( service ).toBeTruthy();
  });

  it('should instance with super user', () => {
    const activated = new ActivatedRouteSnapshot;
    activated.component = StubAppTestComponent;

    expect( service.canActivate( activated ) ).toBe(true, 'new services should be true');
  });
});
