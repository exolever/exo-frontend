import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PromptDataInterface } from './prompt-dialog.interface';

@Component({
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit {
  public textAreaField = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDataInterface
  ) { }

  ngOnInit() {
    if (this.data.textArea && this.data.textArea.isRequired) {
      this.textAreaField.setValidators(Validators.required);
    }
  }

  primaryAction() {
    this.textAreaField.markAsTouched({onlySelf: true});
    const dataToSend = (this.data.textArea && this.textAreaField.value) || true;

    if (this.data.textArea && this.data.textArea.isRequired && this.textAreaField.value === null) {
      return;
    }

    if (!this.data.textArea || !this.textAreaField.errors) {
      this.dialogRef.close(dataToSend);
    }
  }

}
