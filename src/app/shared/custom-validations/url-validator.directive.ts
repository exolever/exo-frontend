import { Directive } from '@angular/core';
import { Validators, Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

import { getControlName } from './shared.functions';

// https://www.regextester.com/94502
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const controlName = getControlName(control);
    const regex = new RegExp(
      '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$');
    return !control.value || regex.test(control.value) ? null : {'urlValidator': controlName };
  };
}

@Directive({
  selector: '[urlValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true }]
})
export class UrlValidatorDirective implements Validator {
  private valFn = Validators.nullValidator;
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}
