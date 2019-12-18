import { AbstractControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { autocompleteArrayValidator } from './autocomplete-array-validator.directive';

describe('Auto complete Array Validation Directive', () => {
  let form;
  let formGroupAutoCompleteValidator: FormGroup;

  beforeEach(() => {
    form = new FormBuilder();
  });

  it('Check if form autoComplete is valid', () => {
    formGroupAutoCompleteValidator = form.group({
      autoComplete: [undefined, Validators.required, autocompleteArrayValidator([1, 2])]
    });
    expect(formGroupAutoCompleteValidator.valid).toBeFalsy();
    formGroupAutoCompleteValidator.setValue({ 'autoComplete': 1 });
    expect(formGroupAutoCompleteValidator.valid).toBeTruthy();
  });
  it('Check autoComplete return the validator name', () => {
    formGroupAutoCompleteValidator = form.group({
      autoComplete: [undefined, Validators.required, autocompleteArrayValidator(['a', 'b'])]
    });
    const validatorFn = autocompleteArrayValidator(['a', 'b']);
    const control = <AbstractControl>formGroupAutoCompleteValidator.controls['autoComplete'];
    const result = validatorFn(control);
    result.subscribe(response => expect(response.autocompleteArrayValidator).toBe('autoComplete'));
  });

});
