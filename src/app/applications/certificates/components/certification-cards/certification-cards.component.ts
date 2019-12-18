import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { UserModel } from '@app/core';
import { StatusEnum } from '@applications/certificates/components/certification-cards/certification-cards.enum';
import { CertificationRequestModel } from '@core/models/user/certification-request.model';
import { CertificationsService } from '@core/modules/certifications/services';
import { CertificationModel } from '@core/modules/certifications/models';

@Component({
  selector: 'app-certification-cards',
  templateUrl: './certification-cards.component.html',
  styleUrls: ['./certification-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationCardsComponent implements OnInit {
  @Input() certifications: CertificationModel[];
  @Input() user: UserModel;
  statusEnum = StatusEnum;
  requestedArray: CertificationRequestModel[];
  requested: CertificationRequestModel;

  constructor(
    private certificationsService: CertificationsService
  ) { }

  ngOnInit() {
    this.requestedArray = this.user.certificationRequests;
  }

  getImage(certification: CertificationModel) {
    return this.certificationsService.getCertificateImage(certification);
  }

  getRequestInfo(certification: CertificationModel) {
    return this.requestedArray.find(cert => cert.certificationCode === certification.code);
  }
}
