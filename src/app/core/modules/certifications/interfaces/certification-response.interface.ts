import { CertificationEnum } from '../enums';

export interface ICertificationResponse {
  code: CertificationEnum;
  name: string;
  description: string;
  level: number;
}
