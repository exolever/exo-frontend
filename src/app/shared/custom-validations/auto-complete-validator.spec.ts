import { AbstractControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { autoCompleteValidator } from './auto-complete-validator.directive';

describe('Auto complete Validation Directive', () => {
  let form;
  let formGroupAutoCompleteValidator: FormGroup;

  beforeEach(() => {
    form = new FormBuilder();
  });

  it('Check if form autoComplete is valid', () => {
    formGroupAutoCompleteValidator = form.group({
      autoComplete: [undefined, Validators.required, autoCompleteValidator()]
    });
    expect(formGroupAutoCompleteValidator.valid).toBeFalsy();
    formGroupAutoCompleteValidator.setValue({ 'autoComplete': { id: '123' } });
    expect(formGroupAutoCompleteValidator.valid).toBeTruthy();
  });
  it('Check autoComplete return falsy validator', () => {
    formGroupAutoCompleteValidator = form.group({
      autoComplete: [undefined, Validators.required, autoCompleteValidator()]
    });
    expect(formGroupAutoCompleteValidator.valid).toBeFalsy();
  });
  it('Check autoComplete return the validator name', () => {
    formGroupAutoCompleteValidator = form.group({
      autoComplete: [undefined, Validators.required, autoCompleteValidator()]
    });
    const validatorFn = autoCompleteValidator();
    const control = <AbstractControl>formGroupAutoCompleteValidator.controls['autoComplete'];
    const result = validatorFn(control);
    result.subscribe(response => expect(response.autoCompleteValidator).toBe('autoComplete'));
  });

});
