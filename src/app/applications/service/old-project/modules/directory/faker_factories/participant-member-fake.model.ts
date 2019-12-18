import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';

import { ParticipantMemberModel } from '../models';
import { StatusMember } from '../models/member.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';


export class FakeParticipantMemberFactory extends FakeModel ( ParticipantMemberModel ) {

  public aboutMe = faker.lorem.paragraph();
  public bioMe = faker.lorem.paragraph();
  public location = 'Granada, Spain';
  public email = faker.internet.email();
  public fullName = faker.name.firstName();
  public permissions = [];
  public profilePictures = [];
  public role = SprintRoleEnum.toString(SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT);
  public roleCode = SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT.toString();
  public shortMe = faker.lorem.words(10);
  public shortName = faker.name.lastName();
  public status = StatusMember.A;
  public teams: Array<string> = [];

  constructor( obj?: any ) {
    super(faker.random.number().toString());

    if ( obj ) { this.assignPropertyToClass( obj ); }
  }
}
