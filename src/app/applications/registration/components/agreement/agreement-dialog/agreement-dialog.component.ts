import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { InvitationActionEnum } from '@shared/enums/invitation.enum';
import { AgreementInvitationModel } from '../../../models/agreement-invitation.model';
import { environment } from '@environments/environment';

declare const fbq: any;

@Component({
  selector: 'app-agreement-dialog',
  templateUrl: 'agreement-dialog.component.html',
  styleUrls: ['./agreement-dialog.component.scss']
})
export class AgreementDialogComponent implements OnInit {
  public agreementInvitation: AgreementInvitationModel;
  public action = InvitationActionEnum;
  public declined = false;

  constructor(public dialogRef: MatDialogRef<AgreementDialogComponent>) { }

  ngOnInit(): void {
    if (typeof fbq === 'undefined') {
      return;
    }

    if (environment.production) {
      fbq('track', 'CompleteRegistration');
    }
  }

}
