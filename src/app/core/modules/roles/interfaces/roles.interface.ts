import { RoleEnum } from '@core/modules/roles/enums';
import { CertificationEnum } from '@core/modules/certifications/enums';

export interface RolesInterface {
  code: RoleEnum;
  name: string;
  certifications?: CertificationEnum[];
}
