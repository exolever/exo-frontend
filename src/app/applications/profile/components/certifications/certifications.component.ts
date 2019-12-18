import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ConsultantModel } from '@applications/shared/models';
import { CertificatesDialogComponent } from '@applications/certificates/dialogs/certificates-dialog.component';
import { UserCertificationModel } from '@core/models/user/user-certification.model';
import { CertificationsService } from '@core/modules/certifications/services';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationComponent {
  @Input() profileUser: ConsultantModel;

  constructor(
    private certificationsService: CertificationsService,
    private dialog: MatDialog
  ) {}

  getImage(certification: UserCertificationModel) {
    return this.certificationsService.getCertificateImage(certification);
  }

  callToAction(certification: UserCertificationModel) {
    window.open(this.certificationsService.getUrlFormToApplyInWebsite(certification), '_blank');
  }

  goTo(certification: UserCertificationModel): void {
    this.openModalCertificate(certification);
  }

  private openModalCertificate(certification: UserCertificationModel) {
    this.dialog.open(
      CertificatesDialogComponent, {
        data: {
          certification: certification
        },
      }
    );
  }
}
