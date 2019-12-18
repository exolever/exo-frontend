import { AgreementModel } from '../../models/user/agreement.model';
import { ExOAgreementSignEnum } from '../../enums/exo-agreement-status.enum';

export interface IUserAgreement {
  status: ExOAgreementSignEnum;
  agreement: AgreementModel;
}
