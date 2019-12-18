import * as faker from 'faker';

import { UserResponseInterface } from '@core/interfaces/network/user-response.interface';
import { segmentUserEnum } from '@core/enums/user.enum';
import { UserStatus } from '@core/enums/user-status.enum';
import { IProjectsInfo } from '@core/interfaces/projects-info.interface';
import { IUserCertificationResponse } from '@core/interfaces/user/user-certifcation.interface';
import { CertificationEnum } from '@core/modules/certifications/enums';

/**
 * mock response for the user, values to certain properties can be added passing an object with properties names as
 * keys and the desired value
 */
export class UserResponseFakeModel implements UserResponseInterface {
  pk: string;
  id: string;
  aboutMe = faker.random.words(13);
  bioMe = faker.name.jobDescriptor();
  company = faker.random.words(2);
  consultantId = faker.random.number({ min: 1, max: 13 });
  email = faker.internet.email();
  emailContact = faker.internet.email();
  entryPoint = faker.random.words(13);
  fullName = faker.name.firstName() + ' ' + faker.name.lastName();
  groups: any = [ { 'name': 'delivery-manager' } ];
  hubs = [{name: 'Consulting', code: 'T'}];
  intercomHash = faker.random.alphaNumeric( 22 );
  isActive = true;
  isStaff = true;
  isSuperuser = false;
  lastLogin = '2018-08-07T07:01:19.052546Z';
  location = 'Abidjan';
  passwordUpdated = false;
  phone = +faker.phone.phoneNumber();
  platformLanguage = faker.locale;
  profileUrl = '/public/william';
  profilePicture = ['/media/avatars/32_32/d1f1f6e909ac50d511a33319faafdf09.jpg'];
  profilePictures = ['/media/avatars/32_32/d1f1f6e909ac50d511a33319faafdf09.jpg'];
  profilePictureOrigin = faker.random.word()[0].toUpperCase();
  segment = segmentUserEnum.Customer;
  shortMe: string = faker.random.words( 7 );
  shortName = faker.name.firstName();
  slug = this.shortName;
  status = UserStatus.CH_ACTIVE;
  timezone = 'Africa/Abidjan';
  userPermissions = [];
  userTitle = 'ExO Ambassador, ExO Board Advisor, ExO Consultant, ExO Foundations';
  userPosition = 'Chief Executive Officer at OpenExO';
  uuid = faker.random.uuid();
  projects = <IProjectsInfo>{
    consultant: faker.random.number({ min: 1, max: 999999 }),
    participant: faker.random.number({ min: 1, max: 999999 }),
    total: faker.random.number({ min: 1, max: 999999 })
  };
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDAsInVzZXJfaWQiOjMsImVtYWlsIjoid' +
    'G9tYXNAZXhvLndvcmtzIiwidXNlcm5hbWUiOiJ0b21hc0BleG8ud29ya3MifQZSwuWEFoadGXYxIGnnypjC9VD74nd-mCNT4Io1uHuDg';
  certificationsRoles = [
    {
      id: faker.random.number(),
      name: faker.random.word(),
      description: faker.random.word(),
      code: faker.random.word(),
      groupBy: null
    }
  ];
  certifications = [
    <IUserCertificationResponse>{
      code: CertificationEnum.FOUNDATION,
      name: 'ExO Foundation',
      description: '',
      level: 0,
      certificates: []
    }
  ];
  desiredActivities = [faker.random.word(), faker.random.word()];
  userAgreements = [];
  sectionsVisited = [];

  constructor() {
    this.pk = this.id = faker.random.number( { min: 1, max: 13 } ).toString();
  }

}
