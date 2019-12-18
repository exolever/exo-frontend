import { InvitationModel } from '@shared/models/invitation.model';

export class AgreementInvitationModel extends InvitationModel {
  text: string;
  file: string;
  file2: string;
  name: string;

  constructor() {
    super();
  }
}
