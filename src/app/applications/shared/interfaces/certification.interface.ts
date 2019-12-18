
import { CertificationEnum } from '@core/modules/certifications/enums';

export interface UserCertificationResponseInterface {
  code: CertificationEnum;
  description: string;
  name: number;
  certificates: Array<CertificateResponseInterface>;
}

export interface CertificateResponseInterface {
  accredibleUrl: string;
  image: any;
  issuedOn: string;
  name: string;
  pdf: string;
}
