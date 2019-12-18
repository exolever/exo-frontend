import { UserPictureInterface } from '@core/interfaces/user/user.picture.interface';

export const sizeProfilePictures = [24, 48, 96, 144];
export class UserPictureModel implements UserPictureInterface {

  height: number;
  width: number;
  url: string;

  constructor(obj: { height: number, width: number, url: string }) {
    this.height = obj.height;
    this.width = obj.width;
    this.url = obj.url;
  }

}
