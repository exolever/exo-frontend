import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';

import { OpportunityApplicantModel } from '@opportunities/models/opportunity-applicant.model';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  message = new FormControl();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      typeAlert: string,
      message: string,
      applicant: OpportunityApplicantModel,
      action: string
    },
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  ) { }

  onAction() {
    const dataToSend = this.message.value || true;
    this.dialogRef.close(dataToSend);
  }

}
