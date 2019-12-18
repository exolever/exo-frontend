import { AbstractControl, FormBuilder } from '@angular/forms';
import { requiredEnterValidator } from './required-and-enter.directive';

describe('Required and enter Validation Directive', () => {
  let form;
  let formGroupEnterValidator;

  beforeEach(() => {
    form = new FormBuilder();
  });

  it('Check if form required enter is valid', () => {
    formGroupEnterValidator = form.group({
      keywords: [[], requiredEnterValidator()]
    });
    expect(formGroupEnterValidator.valid).toBeFalsy();
    formGroupEnterValidator.controls['keywords'].setValue(['chip1', 'chip2']);
    expect(formGroupEnterValidator.valid).toBeTruthy();
  });
  it('Check required enter return validator', () => {
    formGroupEnterValidator = form.group({
      keywords: [[], requiredEnterValidator()]
    });
    const validatorFn = requiredEnterValidator();
    const control = <AbstractControl>formGroupEnterValidator.controls['keywords'];
    const result = validatorFn(control);
    expect(result).toEqual({ requiredEnter: 'keywords' });
  });
});
