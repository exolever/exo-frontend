// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';

import { UrlService } from '@core/services/api/resolve';


import { PasswordRecoverService } from './password-recover.service';
import { HttpClient } from '@angular/common/http';

describe('PasswordRecoverService', () => {
  let httpTestingController: HttpTestingController;
  let passwordService: PasswordRecoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        UrlService,
        PasswordRecoverService
      ]
    });

    // Inject the http service and test controller for each test
    httpTestingController = TestBed.get(HttpTestingController);
    passwordService = new PasswordRecoverService(TestBed.get(HttpClient), TestBed.get(UrlService));

  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /**
      Request password Test
  **/

  it('Requesting new password should show message of not registered email ...', () => {

      const responseData = {'email': 'Email does not match'};
      passwordService.requestPassword('emaiNotRegistered@mail.com').subscribe();

      const req = httpTestingController.expectOne('http://localhost:8000/api/accounts/password/request-change/');

      // Assert that the request is a POST.
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({email: 'emaiNotRegistered@mail.com'});

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(responseData);

      // Finally, assert that there are no outstanding requests.
      httpTestingController.verify();

  });
});

