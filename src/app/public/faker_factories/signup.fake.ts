import * as faker from 'faker';

import { StatusInvitationEnum, InvitationEnum } from '@shared/enums/invitation.enum';
import { FakeModel } from '@shared/faker_factories';

import { SignupModel } from '../models/signup.model';

export class FakeSignupModelFactory extends FakeModel ( SignupModel ) {

  constructor() {
    super();
    this.hash = faker.random.uuid();
    this.status = StatusInvitationEnum.STATUS_CH_ACTIVE;
    this.type = InvitationEnum.TYPE_SIGNUP;
    this.email = faker.internet.email();
  }

}
