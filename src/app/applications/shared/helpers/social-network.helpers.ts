import { socialNetworkType } from '../models/social-network.model';

export function getSocialNetworkType(value): socialNetworkType | undefined {
  let typeSocialNetwork;
  if (value) {
    switch (true) {
      case (value.indexOf(socialNetworkType[socialNetworkType.facebook]) !== -1):
        typeSocialNetwork = socialNetworkType.facebook;
        break;
      case (value.indexOf(socialNetworkType[socialNetworkType.skype]) !== -1):
        typeSocialNetwork = socialNetworkType.skype;
        break;
      case (value.indexOf(socialNetworkType[socialNetworkType.linkedin]) !== -1):
        typeSocialNetwork = socialNetworkType.linkedin;
        break;
      case (value.indexOf(socialNetworkType[socialNetworkType.twitter]) !== -1):
        typeSocialNetwork = socialNetworkType.twitter;
        break;
      case (value.indexOf(socialNetworkType[socialNetworkType.medium]) !== -1):
        typeSocialNetwork = socialNetworkType.medium;
        break;
      default:
        typeSocialNetwork = socialNetworkType.personalLink;
        break;
    }
    return typeSocialNetwork;
  }
  return undefined;
}
