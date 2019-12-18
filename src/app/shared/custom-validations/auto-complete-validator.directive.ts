
import { of as observableOf, Observable } from 'rxjs';
import { Directive } from '@angular/core';
import { Validators, Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

import { getControlName } from './shared.functions';


function isDict(value): boolean {
  return typeof value === 'object' && value !== null && !(value instanceof Array) && !(value instanceof Date);
}
export function autoCompleteValidator(): ValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any }> => {
    const value = control.value;
    const controlName = getControlName(control);
    let isInValid = typeof value === 'string' || value === null || value === undefined;
    if (isDict(value)) {
      const hasNotValue = Object.keys(value).find(key => value[key] === undefined || value[key] === null);
      if (hasNotValue !== undefined) {
        isInValid = true;
      }
    }
    return observableOf(
      isInValid ? { 'autoCompleteValidator': controlName } : null
    );
  };
}

@Directive({
  selector: '[autoCompleteValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AutoCompleteValidatorDirective, multi: true }]
})
export class AutoCompleteValidatorDirective implements Validator {
  private valFn = Validators.nullValidator;
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}
