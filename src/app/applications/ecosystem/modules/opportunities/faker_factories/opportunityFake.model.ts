import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';
import { FakeProjectFactory } from '@applications/service/old-project/faker_factories';
import {
  FakeKeywordFactory,
} from '@applications/shared/faker_factories';
import { RoleCategoryEnum, SprintRoleEnum } from '@core/modules/roles/enums';
import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RoleCategoryModel, RoleModel } from '@core/modules/roles/models';

import { OpportunityModel } from '../models/opportunity.model';
import { FakeOpportunityApplicantFactory } from './opportunityApplicantFake.model';
import { UserActionFakeFactory } from './user-action-fake.model';
import {
  OpportunityActionEnum, AllCurrenciesEnum, OpportunityMode,
  OpportunityTarget, OpportunityDurationUnit, OpportunityUserStatusEnum
} from '../models/opportunity.enum';

export class FakeOpportunityFactory extends FakeModel ( OpportunityModel ) {

  constructor() {
    super( {});
    this.actions = [OpportunityActionEnum.S];
    this.alreadyVisited = faker.random.boolean();
    this.applicants = [new FakeOpportunityApplicantFactory(), new FakeOpportunityApplicantFactory()];
    this.budgets = [{budget: faker.random.number(), currency: AllCurrenciesEnum.D}];
    this.client = faker.lorem.word();
    this.created = MomentTZ(faker.date.past());
    this.description = faker.lorem.paragraph();
    this.startDate = MomentTZ(faker.date.future());
    this.deadlineDate = MomentTZ(faker.date.future());
    this.duration = faker.random.number();
    this.durationUnit = OpportunityDurationUnit.HOUR;
    this.entity = faker.lorem.word();
    this.isNew = faker.random.boolean();
    this.keywords = [new FakeKeywordFactory()];
    this.mode = OpportunityMode.onSite;
    this.location = faker.lorem.word();
    this.placeId = faker.lorem.word();
    this.modified = MomentTZ(faker.date.past());
    this.newApplicants = faker.random.number();
    this.numApplicants = faker.random.number();
    this.numPositions = faker.random.number();
    this.pk = faker.random.number();
    this.project = new FakeProjectFactory();
    this.questions = [
      {id: faker.random.number(), title: faker.lorem.word()},
      {id: faker.random.number(), title: faker.lorem.word()},
      {id: faker.random.number(), title: faker.lorem.word()}
    ];
    this.requestedBy = new UserActionFakeFactory();
    this.exoRole = new RoleModel({
      code: SprintRoleEnum.ACCOUNT_MANAGER_SPRINT,
      name: faker.lorem.word(),
    });
    this.certificationRequired = new CertificationModel(
      CertificationEnum.FOUNDATION, faker.lorem.word(), faker.lorem.word(), 2
    );
    this.exoCategory = new RoleCategoryModel({
      code: RoleCategoryEnum.ADVISOR_CALL,
      roles: [],
      name: faker.lorem.word(),
      description: null,
    });
    this.route = faker.lorem.word();
    this.slug = faker.lorem.word();
    this.subject = faker.lorem.word();
    this.target = OpportunityTarget.OPEN;
    this.recipients = [];
    this.userStatus = OpportunityUserStatusEnum.A;
    this.uuid = faker.lorem.word();
    this.numMessages = { total: faker.random.number(), unread: faker.random.number() };
  }

}
