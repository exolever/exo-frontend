import { InvitationEnum, StatusInvitationEnum } from '../enums/invitation.enum';

export class InvitationModel {
  status: StatusInvitationEnum;
  type: InvitationEnum;
  hash: string;

  protected parseData(data) {
    this.status = data.status;
    this.type = data.type;
  }
}
