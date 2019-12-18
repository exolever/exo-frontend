import { UserModel } from '@core/models';
import { ConsultantModel } from '@applications/shared/models';
import { ParticipantMemberModel } from '@applications/service/old-project/modules/directory/models';
import { CertificationModel } from '@core/modules/certifications/models';

export interface MemberCardInterface {
  user: UserModel | ConsultantModel | ParticipantMemberModel;
  description: string;
  extraInformation?: {tooltip: string, icon: string, description: string}[];
  isActive?: boolean;
  certificates?: CertificationModel[];
  dataE2E?: string;
}
