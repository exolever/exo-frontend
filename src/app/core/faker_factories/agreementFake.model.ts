import * as faker from 'faker';
import { FakeModel } from '@shared/faker_factories';

import { AgreementModel } from '../models/user/agreement.model';
import { ExOAgreementStatusEnum } from '../enums/exo-agreement-status.enum';


export class FakeAgreementFactory extends FakeModel ( AgreementModel ) {

  constructor() {
    super({
      name: faker.random.word(),
      version: faker.random.number().toString(),
      status: ExOAgreementStatusEnum['ACTIVE'],
      filename: faker.random.image(),
      description: faker.random.words()
    });
  }

}
