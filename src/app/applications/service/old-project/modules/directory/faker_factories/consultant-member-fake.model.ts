import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';
import {
  FakeSocialNetworkFactory,
  FakeIndustryFactory,
  FakeLanguageFactory
} from '@applications/shared/faker_factories';
import { socialNetworkType } from '@applications/shared/models/social-network.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';
import { StatusMember, ConsultantMemberModel } from '../models';


export class FakeConsultantMemberFactory extends FakeModel( ConsultantMemberModel ) {

  public aboutMe = faker.lorem.paragraph();
  public bioMe = faker.lorem.paragraph();
  public email = faker.internet.email();
  public fullName = faker.name.firstName();
  public permissions = [];
  public pkConsultant: string = faker.random.number().toString();
  public profilePictures = [];
  public role = 'ExO Coach';
  public roleCode = SprintRoleEnum.SPRINT_COACH_SPRINT.toString();
  public shortMe = faker.lorem.words(10);
  public shortName = faker.name.lastName();
  public status = StatusMember.A;
  public teams: Array<string> = [];

  constructor ( obj?: any  ) {
    super ( faker.random.number().toString() );

    this.setIndustries([new FakeIndustryFactory(), new FakeIndustryFactory()]);
    this.setLanguages([new FakeLanguageFactory(), new FakeLanguageFactory()]);
    this.setSocialNetworks([
      new FakeSocialNetworkFactory().modelPropertiesCustom([{
        name: 'networkType',
        data: socialNetworkType.website
      }]),
      new FakeSocialNetworkFactory().modelPropertiesCustom([{
        name: 'networkType',
        data: socialNetworkType.facebook
      }])
    ]);

    if ( obj ) { this.assignPropertyToClass( obj ); }
  }

}

