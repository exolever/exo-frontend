import { segmentUserEnum } from '@core/enums';

import { UserResponseFakeModel } from './user-response-fake.model';

describe ( 'Model: UserResponseFakeModel', () => {

  it ( 'should create a UserResponseFakeModel instance', () => {
    const fakeUserResponse = new UserResponseFakeModel();

    expect ( fakeUserResponse ).toBeDefined();
  });

  it ( 'should set default values for all model properties', () => {
    const fakeUserResponse = new UserResponseFakeModel();
    const properties = [ 'aboutMe', 'bioMe', 'company', 'consultantId',
      'email', 'emailContact', 'fullName', 'groups', 'id', 'pk', 'intercomHash', 'isActive', 'isStaff',
      'isSuperuser', 'lastLogin', 'location', 'passwordUpdated', 'phone', 'platformLanguage', 'profilePicture',
      'profilePictureOrigin', 'projects', 'segment', 'shortMe', 'shortName', 'slug', 'status', 'timezone',
      'token', 'userPermissions', 'uuid' ];

    properties.forEach( prop => {
      expect( fakeUserResponse[ prop ] ).toBeDefined();
    });
    expect ( typeof fakeUserResponse.aboutMe ).toEqual( 'string' );
    expect ( fakeUserResponse.segment ).toEqual( segmentUserEnum.Customer );
  });

  it ( 'should set values passed in the argument object', () => {
    const fakeUserResponse = new UserResponseFakeModel();
    fakeUserResponse.aboutMe = 'Im a fake, but still a good guy';
    fakeUserResponse.platformLanguage = 'en';
    fakeUserResponse.shortMe = 'Hombredeincognito';

    expect ( fakeUserResponse.aboutMe ).toEqual( 'Im a fake, but still a good guy' );
    expect ( fakeUserResponse.platformLanguage ).toEqual( 'en' );
    expect ( fakeUserResponse.shortMe ).toEqual( 'Hombredeincognito' );
  });

});
