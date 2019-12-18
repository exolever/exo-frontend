import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SNACK_BAR_CONFIG } from '../profile-edition.conf';

@Injectable()
export class ProfileEditSnackBarService {

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  success(message?: string, action?: string): void {
    this.snackBar.open(
      message ? message : this.translateService.instant('DIALOGS.PROFILE_UPDATED'),
      action ? action : this.translateService.instant('NOTIFICATION.CLOSE'),
      SNACK_BAR_CONFIG
    );
  }

  error(): void {
    this.snackBar.open(
      this.translateService.instant('DIALOGS.SOMETHING_WRONG'),
      this.translateService.instant('NOTIFICATION.CLOSE'),
      SNACK_BAR_CONFIG
    );
  }
}
