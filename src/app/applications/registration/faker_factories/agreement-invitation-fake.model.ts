import * as faker from 'faker';
import { FakeModel } from '@shared/faker_factories';
import { StatusInvitationEnum, InvitationEnum } from '@shared/enums/invitation.enum';

import { AgreementInvitationModel } from '../models/agreement-invitation.model';


export class FakeAgreementInvitationFactory extends FakeModel ( AgreementInvitationModel ) {
  text = faker.lorem.paragraph();
  file = faker.internet.url();
  hash = faker.random.uuid();
  status = StatusInvitationEnum.STATUS_CH_ACTIVE;
  type = InvitationEnum.TYPE_AGREEMENT;

  constructor() {
    super();
  }

}
