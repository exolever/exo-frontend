import { getValueEnum } from '@shared/helpers/enum.helper';
import { AgreementModel } from '@core/models/user/agreement.model';
import { ExOActivityStatusEnum } from '../enums/exo-activity-status.enum';

export class ActivityModel {

  constructor(
    public name: string,
    public status?: ExOActivityStatusEnum,
    public code?: string,
    public description?: string,
    public order?: number,
    public agreement?: AgreementModel,
    public icon?: string,
    public requireCertification?: string
  ) { }

  isActive(): boolean {
    return this.status === getValueEnum(ExOActivityStatusEnum, ExOActivityStatusEnum.A);
  }

  toString() {
    return this.name;
  }
}
