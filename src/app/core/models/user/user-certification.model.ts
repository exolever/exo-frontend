import * as MomentTZ from 'moment-timezone';

import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums';

export class UserCertificationModel extends CertificationModel {
  constructor(
    public code: CertificationEnum,
    public name: string,
    public description: string,
    public level: number,
    public certificates: CertificateModel[],
  ) {
    super(code, name, description, level);
  }
}

export class CertificateModel {
  constructor(
    public name: string,
    public pdf: string,
    public url: string,
    public image: string,
    public issueOn: MomentTZ.Moment,
  ) { }
}
