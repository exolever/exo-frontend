import { ICertificationResponse } from '@core/modules/certifications/interfaces';

export interface IUserCertificationResponse extends ICertificationResponse {
  certificates: ICertificateResponse [];
}

interface ICertificateResponse {
  name: string;
  pdf: string;
  url: string;
  image: string;
  issueOn: string;
}
