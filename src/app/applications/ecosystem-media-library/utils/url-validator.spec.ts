import { FormControl } from '@angular/forms';

import { of as observableOf } from 'rxjs';

import { ResourcesServiceStub } from '../services/resources.service.stub';
import { ResourcesService } from '../services/resources.service';
import { ValidateVideoURL } from './url-validator';

describe('ValidateVideoURL', () => {
  let service;
  let validator;

  beforeEach(() => {
    service = new ResourcesServiceStub();
    validator = ValidateVideoURL(<ResourcesService>service);
  });

  it('should return true when you have a 200 HTTP response', () => {
    spyOn(service, 'checkURL').and.returnValue(observableOf(true));

    const control = new FormControl('', [], validator);
    control.setValue('example.com');

    expect(control.valid).toEqual(true);
  });

  it('should return false when you DON\'T have a 200 HTTP response', () => {
    spyOn(service, 'checkURL').and.returnValue(observableOf(false));

    const control = new FormControl('', [], validator);
    control.setValue('example.com');

    expect(control.valid).toEqual(false);
  });
});
