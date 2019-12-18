/*import { AbstractControl, FormBuilder } from '@angular/forms';
import { minSelectedCheckboxes } from './min-selected-checkboxes-validator';

describe('Min option selected', () => {
  let form;
  let formGroup;

  beforeEach(() => {
    form = new FormBuilder();
  });

  it('Check if form positiveNumberValidator is valid', () => {
    formGroup = form.group({
      reasons: [[], minSelectedCheckboxes()]
    });
    formGroup.controls['reasons'].setValue([true, true]);
    expect(formGroup.valid).toBeTruthy();
    formGroup.controls['reasons'].setValue([]);
    expect(formGroup.valid).toBeFalsy();

    formGroup = form.group({
      reasons: [[], minSelectedCheckboxes(3)]
    });
    formGroup.controls['reasons'].setValue([true, true]);
    expect(formGroup.valid).toBeFalsy();
    formGroup.controls['reasons'].setValue([true, true, true]);
    expect(formGroup.valid).toBeTruthy();
  });
  it('Check positiveNumberValidator return validator', () => {
    formGroup = form.group({
      reasons: ['Test', minSelectedCheckboxes()]
    });
    const validatorFn = minSelectedCheckboxes();
    const control = <AbstractControl>formGroup.controls['reasons'];
    const result = validatorFn(control);
    expect(result).toEqual({ minSelectedCheckboxes: true });
  });
});*/
