import { InvitationModel } from '@shared/models/';

export class SignupModel extends InvitationModel {
  email: string;
  constructor() {
    super();
  }
}
