import { ExOAgreementStatusEnum } from '../../enums/exo-agreement-status.enum';

export class AgreementModel {
  name: string;
  version: string;
  status: ExOAgreementStatusEnum;
  filename: string;
  description?: string;
  pk?: number;
  pdf?: string;
  html?: string;
  constructor(data) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return ExOAgreementStatusEnum[this.status] === ExOAgreementStatusEnum.A.toString() ;
  }

  isInactive(): boolean {
    return ExOAgreementStatusEnum[this.status] === ExOAgreementStatusEnum.I.toString() ;
  }

}
