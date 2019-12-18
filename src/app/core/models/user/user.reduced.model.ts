import { UserPictureModel } from '@core/models/user/user-picture.model';
import { getUserProfilePicture } from '@core/utils/user-functions';

export class UserReducedModel {
  pk: string;
  shortName: string;
  fullName: string;
  slug: string;
  profilePictures: Array<UserPictureModel> = [];
  roles: string;

  constructor(obj: {
    pk: string,
    shortName: string,
    fullName: string,
    slug: string,
    profilePictures: { height: number, width: number, url: string }[],
  }) {
    this.pk = obj.pk.toString();
    this.shortName = obj.shortName;
    this.fullName = obj.fullName;
    this.slug = obj.slug;
    this.profilePictures = obj.profilePictures.map(pic => new UserPictureModel(pic));
  }

  /**
   * return the profile picture based on the size
   * @param size
   */
  getPicture(size: number): string | undefined {
    return getUserProfilePicture(size, this.profilePictures);
  }

  setRoles(roles: string): void {
    this.roles = roles;
  }

}
