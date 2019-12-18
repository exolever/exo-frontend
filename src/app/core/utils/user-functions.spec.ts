import { getUserProfilePicture } from '@core/utils/user-functions';
import { sizeProfilePictures, UserPictureModel } from '@app/core';

describe('User functions', () => {
  it('getUserProfilePicture return image', () => {
    const userPictures = [new UserPictureModel({ height: 144, width: 144, url: 'imageTestUrl' })];
    expect(getUserProfilePicture(sizeProfilePictures[3], userPictures)).toEqual('imageTestUrl');
  });

  it('getUserProfilePicture return undefined', () => {
    const userPictures = [new UserPictureModel({ height: 144, width: 144, url: 'imageTestUrl' })];
    expect(getUserProfilePicture(sizeProfilePictures[1], userPictures)).toBeUndefined();
  });
});
