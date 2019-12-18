import { AbstractControl, FormBuilder } from '@angular/forms';
import { positiveNumberValidator } from './positive-number-validator.directive';

describe('Number Validation Directive', () => {
  let form;
  let formGroup;

  beforeEach(() => {
    form = new FormBuilder();
  });

  it('Check if form positiveNumberValidator is valid', () => {
    formGroup = form.group({
      amount: [[], positiveNumberValidator()]
    });
    formGroup.controls['amount'].setValue(999);
    expect(formGroup.valid).toBeTruthy();
    formGroup.controls['amount'].setValue('Test');
    expect(formGroup.valid).toBeFalsy();
  });
  it('Check positiveNumberValidator return validator', () => {
    formGroup = form.group({
      amount: ['Test', positiveNumberValidator()]
    });
    const validatorFn = positiveNumberValidator();
    const control = <AbstractControl>formGroup.controls['amount'];
    const result = validatorFn(control);
    expect(result).toEqual({ positiveNumberValidator: 'amount' });
  });
});
