import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { InvitationActionEnum } from '@shared/enums/invitation.enum';
import { Urls, UrlService } from '@core/services';

import { AgreementInvitationModel } from '../../../models/agreement-invitation.model';

@Component({
  selector: 'app-update-tos-dialog',
  templateUrl: 'update-tos-dialog.component.html'
})
export class UpdateTOSDialogComponent {
  public agreementInvitation: AgreementInvitationModel;
  public action = InvitationActionEnum;

  constructor(
    public dialogRef: MatDialogRef<UpdateTOSDialogComponent>,
    private urlService: UrlService,
    private router: Router
  ) {}

  goToLogin() {
    this.dialogRef.close({action: this.action.DECLINE});
    const url = this.urlService.getPath([Urls.LOGIN]);
    this.router.navigate([url]);
  }

  getFilename(file: string): string {
    const info = file.split('/');
    return info ? decodeURI(info.pop()) : '' ;
  }
}
