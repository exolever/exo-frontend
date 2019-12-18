import { CertificationEnum } from '../enums';

export class CertificationModel {
  constructor(
    public code: CertificationEnum,
    public name: string,
    public description: string,
    public level: number,
  ) { }

  isFoundation(): boolean {
    return this.code === CertificationEnum.FOUNDATION;
  }
}
