import { StatusEnum } from '@applications/certificates/components/certification-cards/certification-cards.enum';
import * as MomentTZ from 'moment-timezone';
import { CertificationEnum } from '@core/modules/certifications/enums';

export class CertificationRequestModel {
  status: StatusEnum;
  level: string;
  certificationCode: CertificationEnum;
  name?: string;
  startDate?: MomentTZ.Moment;
  url?: string;

  constructor(data) {
    Object.assign(this, data);
  }

  getStatus() {
    return this.status;
  }
}
