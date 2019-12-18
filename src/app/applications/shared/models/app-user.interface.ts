import * as MomentTZ from 'moment-timezone';

import { UserPictureModel } from '@core/models/user/user-picture.model';
import { IUserAgreement } from '@core/interfaces/user/user-agreement.interface';

import { SocialAuthModel } from '../models/social-auth.model';
import { SocialNetworkModel } from '../models/social-network.model';

export interface IAppUser {
  /** social network to be expcluded from sn contact lists */
  readonly snToExclude: Array<string>;
  /** user data */
  uuid: string;
  shortName: string;
  fullName: string;
  email: string;
  // emailContact: string;
  phone: string;
  profilePictures: Array<UserPictureModel>;
  location: string;
  timezone: string;
  created: MomentTZ.Moment;
  passwordUpdated: boolean;
  socialNetworks: Array<SocialNetworkModel>;
  socialAuths: Array<SocialAuthModel>;
  agreements: Array<IUserAgreement>;
  /** user description and bio */
  aboutMe: string;
  shortMe: string;
  bioMe: string;
}
