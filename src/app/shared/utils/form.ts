import { AbstractControl, FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';

export function ShowErrors(isSubmitted: boolean, form: FormGroup, field: string): boolean {
  return (!form.get(field).valid && (isSubmitted || form.get(field).dirty));
}

export function SetFocusOnInvalid(form: FormGroup, element: ElementRef): void {
  Object.keys(form.controls).forEach(control => {
    if (form.get(control).invalid) {
      const selector = element.nativeElement.querySelector('[formControlName='.concat(control).concat(']'));
      if (selector) {
        selector.focus();
      }
    }
  });
}

export function HasKnownErrors(form: FormGroup | AbstractControl, errorMessage: any, defaultKey?: string): boolean {
  let knownErrors = false;
  for (const key in errorMessage.error) {
    if (errorMessage.error.hasOwnProperty(key)) {
      const value = errorMessage.error[key];
      if (form.get(key)) {
        form.get(key).setErrors({ 'custom': Array.isArray(value) ? value[0] : value });
        knownErrors = true;
      } else if (defaultKey) {
        form.get(defaultKey).setErrors({ 'custom': Array.isArray(value) ? value[0] : value });
        knownErrors = true;
      }
    }
  }
  return knownErrors;
}
