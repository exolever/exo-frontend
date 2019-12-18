import { AbstractControl, FormGroup } from '@angular/forms';

export function getControlName(control: AbstractControl) {
  let controlName = null;
  const parent = control.parent;
  if (parent instanceof FormGroup) {
    Object.keys(parent.controls).forEach((name) => {
      if (control === parent.controls[name]) {
        controlName = name;
      }
    });
  }
  return controlName;
}
