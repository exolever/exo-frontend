import { UserPictureModel } from '@core/models/user/user-picture.model';

/**
 * gets the user picture based on the size
 * @param size
 * @param profilePictures
 */
export function getUserProfilePicture(size: number, profilePictures: UserPictureModel[]): string | undefined {
  const picture = profilePictures.find((pic: UserPictureModel) => pic.height === size);
  return picture ? picture.url : undefined;
}
