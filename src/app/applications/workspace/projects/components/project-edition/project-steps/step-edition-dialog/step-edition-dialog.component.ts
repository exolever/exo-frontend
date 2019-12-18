import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import {ShowErrors} from '@shared/utils/form';
import { IValidationForm } from '@shared/utils/form.interface';
import { messageHintErrorAnimation } from '@animations/message-hint-error.animation';
import { AppState } from '@core/store/reducers';
import * as StepsActions from '@applications/workspace/projects/store/action/steps.action';

@Component({
  selector: 'app-step-edition-dialog',
  templateUrl: './step-edition-dialog.component.html',
  styleUrls: ['./step-edition-dialog.component.scss'],
  animations: [messageHintErrorAnimation]
})
export class StepEditionDialogComponent implements OnInit, IValidationForm {
  form: FormGroup;
  isSubmitted = false;
  subscriptAnimationState = 'enter';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StepEditionDialogComponent>,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.form = this.fb.group ({
      'startDate': [this.data.step.start, Validators.required]
    });
  }

  showErrors(field: string): boolean {
    return ShowErrors(this.isSubmitted, this.form, field);
  }

  onSave() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.data.step.start = this.form.get('startDate').value;
      this.store.dispatch(new StepsActions.Edit({
        step: this.data.step,
        projectPk: this.data.projectPk
      }));
      this.dialogRef.close();
    }
  }

}
