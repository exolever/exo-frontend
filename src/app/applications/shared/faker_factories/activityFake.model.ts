import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';
import { AgreementModel } from '@core/models/user/agreement.model';

import {
  ActivitiesConfigurationArray
} from '../interfaces/activities-configuration.interface';
import { ActivityModel } from '../../shared/models/activity.model';
import { ExOActivityStatusEnum } from '../enums/exo-activity-status.enum';


export class FakeActivityFactory extends FakeModel ( ActivityModel ) {

  constructor(
    public name: string = faker.random.word(),
    public status = ExOActivityStatusEnum[
      faker.helpers.replaceSymbolWithNumber(
      faker.random.arrayElement(Object.getOwnPropertyNames(ExOActivityStatusEnum))
      )
    ],
    public code: string = faker.random.arrayElement(
      ActivitiesConfigurationArray.map(act => act.code)),
    public description: string = faker.random.words(),
    public order: number = faker.random.number(),
    public agreement: AgreementModel = null
  ) {
    super(name, status, code, description, order, agreement);
  }

}
