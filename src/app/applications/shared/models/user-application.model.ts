import * as MomentTZ from 'moment-timezone';

import {
  IUserApplicationBackendResponse
} from '@applications/shared/interfaces/user-consultant-backend-response.interface';
import { UserPictureModel } from '@core/models/user/user-picture.model';
import { PermissionMixin } from '@core/models/permission.model';
import { IAppUser } from '@applications/shared/models/app-user.interface';
import { IUserAgreement } from '@core/interfaces/user/user-agreement.interface';
import { UserCertificationModel, CertificateModel } from '@core/models/user/user-certification.model';

import { SocialNetworkModel, socialNetworkType } from './social-network.model';
import { SocialAuthModel } from './social-auth.model';
import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums/certification.enum';

export class UserApplicationModel extends PermissionMixin implements IAppUser {
  uuid: string;
  shortName: string;
  fullName: string;
  email: string;
  // emailContact: string;
  phone: string;
  profilePictures: Array<UserPictureModel>;
  slug: string;
  permissions: Array<string>;
  location: string;
  placeId: string;
  timezone: string;
  created: MomentTZ.Moment;
  passwordUpdated: boolean;
  socialNetworks: Array<SocialNetworkModel>;
  socialAuths: Array<SocialAuthModel>;
  agreements: Array<IUserAgreement>;
  certifications: UserCertificationModel[];
  isOpenExOMember: boolean;
  /** user description and bio */
  aboutMe: string;
  shortMe: string;
  bioMe: string;
  userTitle: string;
  userPosition: string;

  readonly snToExclude: Array<string>;

  constructor(public pk: string, initializer?: IUserApplicationBackendResponse) {
    /**
     * Creates a new instance for a "Regular" user. Is used on the entire application
     * Params:
     *  - pk: <python> User pk
     */
    super();
    this.profilePictures = [];
    this.snToExclude = [socialNetworkType.skype.toString()];
    if (initializer) {
      Object.keys(initializer).forEach(key => {
        if ( key !== 'consultant' ) {
          this[key] = initializer[key];
        }
      });
    }
  }

  getPicture(size: number): string | undefined {
    const picture = this.profilePictures.find((pic: UserPictureModel) => pic.width === size);
    return picture ? picture.url : undefined;
  }

  getProfilePictureURL() {
    return this.getPicture(144);
  }

  getSocialNetwork(typeSocial: string): string {
    if (typeof this.socialNetworks === 'undefined') { return undefined; }
    const sn = this.socialNetworks.find((obj: SocialNetworkModel) => obj.networkType === typeSocial);
    const link = sn !== undefined ? sn.value : '';
    if (socialNetworkType.skype.toString() === typeSocial) {
      return link;
    } else {
      return (link !== '' && link.indexOf('http') < 0) ? 'http://' + link : link;
    }
  }

  getAuthSocial(typeSocial: string): string {
    let username;
    if (this.socialAuths && this.socialAuths.length) {
      const sn = this.socialAuths.find((obj: SocialAuthModel) => obj.provider === typeSocial);
      username = sn ? sn.username : '';
    }
    return username;
  }

  getPublicSocialNetworks(excludePersonalWebsite = true): Array<SocialNetworkModel> {
    if (typeof this.socialNetworks === 'undefined') { return []; }
    if (excludePersonalWebsite) {
      this.snToExclude.push(socialNetworkType.website.toString());
    }
    return this.socialNetworks.filter(obj => !this.snToExclude.includes(obj.networkType));
  }

  setSocialNetworks(socialNetworks: Array<SocialNetworkModel>) {
    this.socialNetworks = socialNetworks;
  }

  setCertificates(certifications: Array<UserCertificationModel>) {
    this.certifications = certifications;
  }

  isConsultant(): boolean {
    return this.hasOwnProperty('pkConsultant');
  }

  setSocialAuths(socialAuths: Array<SocialAuthModel>) {
    this.socialAuths = socialAuths;
  }

  removeSocialNetworkAuth(typeSocial: string) {
    const sn_object = this.socialNetworks.find((obj: SocialNetworkModel) =>
      obj.getNetworkTypeDisplay() === typeSocial);
    this.socialNetworks = this.socialNetworks.filter(obj => obj !== sn_object);
    const social_object = this.socialAuths.find((obj: SocialAuthModel) => obj.provider === typeSocial);
    this.socialAuths = this.socialAuths.filter(obj => obj !== social_object);
  }

  hasHeadline(): boolean {
    return this.shortMe !== '' && this.shortMe != null;
  }

  getHeadline(): string {
    return this.shortMe;
  }

  hasSummary(): boolean {
    return this.aboutMe !== '' && this.aboutMe != null;
  }

  getSummary(): string {
    return this.aboutMe;
  }

  hasBio(): boolean {
    return this.bioMe !== '' && this.bioMe != null;
  }

  getBio(): string {
    return this.bioMe;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  getCertificates(certification: CertificationModel): CertificateModel[] {
    return this.certifications.find(cert => cert.code === certification.code).certificates;
  }

  isCertifiedInCode(certification: CertificationEnum): boolean {
    return this.certifications.some((cert: UserCertificationModel) => cert.code === certification);
  }

}
