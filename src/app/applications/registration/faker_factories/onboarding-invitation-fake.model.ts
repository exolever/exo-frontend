import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';
import { StatusInvitationEnum, InvitationEnum } from '@shared/enums/invitation.enum';

import { OnboardingInvitationModel, ProfilePictureOrigin } from '../models/onboarding-invitation.model';

export class FakeOnboardingInvitationFactory extends FakeModel ( OnboardingInvitationModel ) {
  text = faker.lorem.paragraph();
  file = faker.internet.url();
  hash = faker.random.uuid();
  status = StatusInvitationEnum.STATUS_CH_ACTIVE;
  type = InvitationEnum.TYPE_AGREEMENT;

  fullName = faker.lorem.word();
  shortName = faker.lorem.word();
  location = faker.address.city() + ', ' + faker.address.country();
  shortMe = faker.lorem.paragraph();
  bioMe = faker.lorem.paragraph();
  picture = faker.internet.url();
  languages = [faker.random.number()];
  picture_origin = ProfilePictureOrigin.PROFILE_PICTURE_CH_DEFAULT;

}
