import { Directive, Input, OnChanges } from '@angular/core';
import { Validators, Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

import { getControlName } from './shared.functions';


export function requiredEnterValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    const controlName = getControlName(control);
    return value.length === 0 ? { 'requiredEnter': controlName } : null;
  };
}

@Directive({
  selector: '[requiredEnter]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RequiredEnterValidatorDirective, multi: true }]
})
export class RequiredEnterValidatorDirective implements Validator, OnChanges {
  @Input() requiredEnter: string;
  private valFn = Validators.required;
  ngOnChanges(): void {
    this.valFn = requiredEnterValidator();
  }
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}
