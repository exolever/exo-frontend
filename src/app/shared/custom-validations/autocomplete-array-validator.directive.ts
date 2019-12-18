
import { of as observableOf, Observable } from 'rxjs';
import { Directive } from '@angular/core';
import { Validators, Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

import { getControlName } from './shared.functions';

export function autocompleteArrayValidator(values: Array<string|number>): ValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any }> => {
    const value = control.value;
    const controlName = getControlName(control);
    const isInValid = values.find(v => value === v) === undefined;
    return observableOf(
      isInValid ? { 'autocompleteArrayValidator': controlName } : null
    );
  };
}

@Directive({
  selector: '[autocompleteArrayValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AutoCompleteArrayValidatorDirective, multi: true }]
})
export class AutoCompleteArrayValidatorDirective implements Validator {
  private valFn = Validators.nullValidator;
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}
