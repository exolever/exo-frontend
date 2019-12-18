import {InvitationModel} from '@shared/models/invitation.model';

export abstract class ProfilePictureOrigin {
  static PROFILE_PICTURE_CH_DEFAULT = 'D';
  static PROFILE_PICTURE_CH_LINKEDIN = 'L';
  static PROFILE_PICTURE_CH_USER = 'U';
}


export class OnboardingInvitationModel extends InvitationModel {
  fullName: string;
  shortName: string;
  location: string;
  placeId: string;
  shortMe: string;
  bioMe: string;
  profilePicture: string;
  languages: Array<number>;
  profilePictureOrigin: string;
  personalMtp: string;
}
