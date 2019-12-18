import { AbstractControl, FormBuilder } from '@angular/forms';
import { urlValidator } from './url-validator.directive';

describe('Url Validation Directive', () => {
  let form;
  let formGroupEnterValidator;

  beforeEach(() => {
    form = new FormBuilder();
  });

  it('Check if form urlValidator is valid', () => {
    formGroupEnterValidator = form.group({
      url: [[], urlValidator()]
    });
    expect(formGroupEnterValidator.valid).toBeFalsy();
    formGroupEnterValidator.controls['url'].setValue('www.google.es');
    expect(formGroupEnterValidator.valid).toBeTruthy();
    formGroupEnterValidator.controls['url'].setValue('http://asdf');
    expect(formGroupEnterValidator.valid).toBeFalsy();
  });
  it('Check urlValidator return validator', () => {
    formGroupEnterValidator = form.group({
      url: [[], urlValidator()]
    });
    const validatorFn = urlValidator();
    const control = <AbstractControl>formGroupEnterValidator.controls['url'];
    const result = validatorFn(control);
    expect(result).toEqual({ urlValidator: 'url' });
  });
});
