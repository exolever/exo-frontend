import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import { CertificationsService } from '@core/modules/certifications/services';
import { CertificationModel } from '@core/modules/certifications/models';

@Component({
  templateUrl: './required-certification-dialog.component.html',
  styleUrls: ['./required-certification-dialog.component.scss']
})
export class RequiredCertificationDialogComponent {
  certification: CertificationModel;
  prefix: string;
  title: string;
  content: string;
  image: string;

  constructor(
    private translate: TranslateService,
    private certificationsService: CertificationsService,
    public dialogRef: MatDialogRef<RequiredCertificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.certification = data.certification;
    this.prefix = data.prefix;
    this.modalBoxTitle();
    this.modalBoxContent();
    this.modalImage();
  }

  onClose() {
    this.dialogRef.close();
  }

  private modalImage(): void {
    this.image = this.certificationsService.getCertificateImage(this.certification);
  }

  private modalBoxTitle(): void {
    this.title = this.translate.instant(`${this.prefix}.TITLE.${this.certification.code}`);
  }

  private modalBoxContent(): void {
    const url = this.certificationsService.getHelpCenterUrl(this.certification);
    this.content = this.translate.instant(`${this.prefix}.MESSAGE.${this.certification.code}`, {url: url});
  }
}
