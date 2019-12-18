import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { UserCertificationModel } from '@core/models/user/user-certification.model';
import { CertificationsService } from '@core/modules/certifications/services';

@Component({
  templateUrl: './certificates-dialog.component.html',
  styleUrls: ['./certificates-dialog.component.scss']
})
export class CertificatesDialogComponent {

  certification: UserCertificationModel;

  constructor(
    private certificationsService: CertificationsService,
    @Inject(MAT_DIALOG_DATA) public data: { certification: UserCertificationModel }
  ) {
    this.certification = data.certification;
  }

  getImage(certification: UserCertificationModel) {
    return this.certificationsService.getCertificateImage(certification);
  }

}
