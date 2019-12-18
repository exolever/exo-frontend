import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeUserModelFactory } from '@core/faker_factories';
import { FakeModel } from '@shared/faker_factories';

import { OpportunityApplicantModel } from '../models/opportunity-applicant.model';
import {
  OpportunityActionEnum, OpportunityMode, AllCurrenciesEnum, OpportunityApplicantStatusEnum, OpportunityDurationUnit
} from '../models/opportunity.enum';

export class FakeOpportunityApplicantFactory extends FakeModel ( OpportunityApplicantModel ) {

  startDate: MomentTZ.Moment;

  constructor() {
    super();
    this.pk = faker.random.number();
    this.answers = [{
      question: {id: faker.random.number(), title: faker.lorem.word()},
      responseText: faker.lorem.paragraph()
    }];
    this.opportunityPk = faker.random.number();
    this.user = new FakeUserModelFactory();
    this.questionsExtraInfo = faker.lorem.paragraph();
    this.declinedMessage = faker.lorem.paragraph();
    this.status = OpportunityApplicantStatusEnum.A;
    this.actions = [OpportunityActionEnum.D];
    this.summary = faker.lorem.paragraph();
    this.sow = {
      title: faker.lorem.word(),
      description: faker.lorem.words(),
      location: faker.lorem.word(),
      placeId: faker.lorem.word(),
      locationUrl: '',
      infoDetail: '',
      mode: OpportunityMode.onSite,
      entity: faker.lorem.word(),
      startDate: this.getStartDate(),
      startTime: this.getStartDate().add(1, 'hours'),
      endDate: MomentTZ(faker.date.future()),
      timeZone: 'Europe/Madrid',
      budgets: [{budget: faker.random.number(), currency: AllCurrenciesEnum.D}],
      duration: 2,
      durationUnit: OpportunityDurationUnit.HOUR,
      files: []
    };
  }

  private getStartDate(): MomentTZ.Moment {
    if (!this.startDate) {
      this.startDate = MomentTZ(faker.date.past());
    }
    return this.startDate;
  }
}
