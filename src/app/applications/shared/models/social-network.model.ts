import * as MomentTZ from 'moment-timezone';

import { getValueEnum } from '@shared/helpers/enum.helper';

export enum socialNetworkType {
  linkedin = <any>'L',
  twitter = <any>'T',
  facebook = <any>'F',
  skype = <any>'S',
  medium = <any>'M',
  website = <any>'P',
  personalLink = <any>'N'
}

export class SocialNetworkModel {
  networkType: string;
  value: string;
  pk?: string;
  created?: MomentTZ.Moment;
  modified?: MomentTZ.Moment;

  set(socialNetwork: any) {
    this.pk = socialNetwork.pk;
    this.created = socialNetwork.created;
    this.value = socialNetwork.value;
    this.networkType = socialNetwork.networkType;
    this.modified = socialNetwork.modified;
  }

  /**
   * return the name of the network with the appropriate letters in uppercase
   * @returns {string}
   */
  getName(): string {
    switch (socialNetworkType[this.networkType]) {
      case socialNetworkType['P']:
        return 'COMMON.PERSONAL_WEBSITE';
      case socialNetworkType['L']:
        return 'LinkedIn';
      case socialNetworkType['N']:
        return 'COMMON.PERSONAL_LINK';
      default:
        const name = socialNetworkType[this.networkType];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  isPersonalWebsite(): boolean {
    return this.networkType === socialNetworkType.website.toString();
  }

  isPersonalLink(): boolean {
    return this.networkType === socialNetworkType.personalLink.toString();
  }

  getNetworkTypeDisplay(): string {
    return getValueEnum(socialNetworkType, this.networkType);
  }

  getIconName(): string {
    switch (socialNetworkType[this.networkType]) {
      case socialNetworkType['F']:
        return 'facebook-f';
      case socialNetworkType['L']:
        return 'linkedin-in';
      case socialNetworkType['M']:
        return 'medium-m';
      default:
        const name = socialNetworkType[this.networkType];
        return name.charAt(0) + name.slice(1);
    }
  }

}
