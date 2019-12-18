import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ChangeEmailService } from '@applications/profile/services/change-email.service';
import { HasKnownErrors } from '@shared/utils/form';

@Component({
  templateUrl: './platform-change-email.component.html'
})
export class PlatformChangeEmailComponent implements OnInit {

  changeEmailForm: FormGroup;
  private successEmailChangeMessage = this.translateService.instant('DIALOGS.EMAIL_CHANGED_SUCCESSFULLY');

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    private emailService: ChangeEmailService,
    private dialogRef: MatDialogRef<PlatformChangeEmailComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.changeEmailForm = this.fb.group({
      'newEmail': [this.data.user.email, [Validators.required, Validators.email]]
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.changeEmailForm.markAsDirty();
    if (this.changeEmailForm.valid) {
      this.emailService.checkEmail(
        this.changeEmailForm.value.newEmail,
        this.data.user.pk
      )
        .subscribe(() => {
          this.emailService.changeEmail(
            this.changeEmailForm.value.newEmail,
            this.data.user.pk
          )
            .subscribe(response => {
              this.dialogRef.close(response.email);
              this.snackBar.open(this.successEmailChangeMessage, this.translateService.instant('NOTIFICATION.CLOSE'));
            },
              err => {
                HasKnownErrors(this.changeEmailForm, err, 'newEmail');
              });
        },
          err => {
            HasKnownErrors(this.changeEmailForm, err, 'newEmail');
          });
    }
  }
}
