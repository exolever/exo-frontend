import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-link-dialog',
  templateUrl: './link-dialog.component.html'
})
export class LinkDialogComponent {
  public linkForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LinkDialogComponent>,
    private fb: FormBuilder
  ) {
    this.createForm();
  }
  createForm() {
    this.linkForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      link: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.linkForm.valid) {
      const formModel = this.linkForm.value;
      this.dialogRef.close({
        name: formModel.name,
        link: formModel.link
      });
    }
  }

}
