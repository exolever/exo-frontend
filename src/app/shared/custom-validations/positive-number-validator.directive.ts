import { Directive } from '@angular/core';
import { Validators, Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

import { getControlName } from './shared.functions';


export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const controlName = getControlName(control);
    const regex = new RegExp(
      /^[0-9]*$/);
    return !control.value || regex.test(control.value) ? null : {'positiveNumberValidator': controlName };
  };
}

@Directive({
  selector: '[positiveNumberValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PositiveNumberValidatorDirective, multi: true }]
})
export class PositiveNumberValidatorDirective implements Validator {
  private valFn = Validators.nullValidator;
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}

