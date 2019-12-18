import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';
import { IExOAttribute } from '@applications/shared/interfaces';
import { ConsultantStatusEnum } from '@applications/shared/enums/consultant-status.enum';
import { KeywordModel } from '@applications/shared/models/keyword.model';
import { FakeSocialNetworkFactory } from '@applications/shared/faker_factories/social-network-fake.model';
import { BadgeModel } from '@applications/shared/models/badge.model';

import { ConsultantModel, ActivityModel } from '@applications/shared/models';
import { FakeIndustryFactory } from './industryFake.model';
import { FakeLanguageFactory } from './languageFake.model';
import { FakeKeywordFactory } from './keywordFake.model';
import { FakeActivityFactory } from './activityFake.model';
import { FakeIExOAttributeFactory } from './exo-attibute.interface';

export class FakeConsultantFactory extends FakeModel ( ConsultantModel ) {

  aboutMe = faker.lorem.words(20);
  activities: Array<ActivityModel>;
  areasExpertise = [faker.lorem.words(1), faker.lorem.words(1)];
  availability = faker.random.words(1);
  availabilityHours = faker.random.number(3);
  bioMe = faker.lorem.paragraph();
  consultantStatus = ConsultantStatusEnum.D;
  created = MomentTZ().utc();
  email = faker.internet.email();
  emailContact = faker.internet.email();
  exoAreas = [faker.lorem.words(1), faker.lorem.words(1)];
  exoAttributes: Array<IExOAttribute> = [];
  expertises = [];
  fullName = faker.name.firstName();
  industries = [];
  isCertified = true;
  keywords: KeywordModel[] = [];
  languages = [];
  legalCompanyName = faker.random.word();
  taxId = faker.random.number();
  legalName = faker.random.word();
  mtp = faker.random.words(5);
  permissions = [];
  pkConsultant: string = faker.random.number().toString();
  profilePictures = [];
  rolesWithProjects = [];
  badgesActivity: Array<BadgeModel> = [];
  shortMe = faker.lorem.words(10);
  shortName = faker.name.lastName();
  socialNetworks = [new FakeSocialNetworkFactory()];
  technologies = [];
  valueMTP = faker.random.number(5);
  projectsNumber = faker.random.number();
  uuid = faker.random.uuid();

  constructor() {
    super( faker.random.number().toString() );
    this.activities = [
      new FakeActivityFactory().modelPropertiesCustom(),
      new FakeActivityFactory().modelPropertiesCustom()
    ];
    this.exoAttributes = [FakeIExOAttributeFactory([]), FakeIExOAttributeFactory([])];
    this.expertises = [
      new FakeKeywordFactory(),
      new FakeKeywordFactory()
    ];
    this.industries = [new FakeIndustryFactory(), new FakeIndustryFactory()];
    this.languages = [new FakeLanguageFactory(), new FakeLanguageFactory()];
    this.technologies = [new FakeKeywordFactory(), new FakeKeywordFactory()];
  }

}
