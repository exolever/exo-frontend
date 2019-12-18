import * as MomentTZ from 'moment-timezone';

import { getUserProfilePicture } from '@core/utils/user-functions';
import { IProjectsInfo } from '@core/interfaces/projects-info.interface';
import { segmentUserEnum, UserStatus } from '@core/enums';
import { ActivityModel } from '@applications/shared/models/activity.model';
import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationRequestModel } from '@core/models/user/certification-request.model';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { UserResponseInterface } from '@core/interfaces/network/user-response.interface';

import { AgreementModel } from './agreement.model';
import { UserPictureModel } from './user-picture.model';
import { UserCertificationModel, CertificateModel } from './user-certification.model';

export class UserModel {
  aboutMe: string;
  bioMe: string;
  company: string;
  email: string;
  entryPoint: string;
  fullName: string;
  groups: Array<any> = [];
  hubs: Array<{ name: string, code: string }>;
  intercomHash: string;
  isActive: boolean;
  isSuperuser: boolean;
  isStaff: boolean;
  language: string;
  lastLogin: MomentTZ.Moment;
  phone: number;
  pk: string;
  onLine?: boolean;
  pkConsultant: string;
  profilePictures: Array<UserPictureModel> = [];
  profileUrl: string;
  projects: IProjectsInfo;
  segment: segmentUserEnum;
  shortMe: string;
  shortName: string;
  slug: string;
  status: string;
  location: string;
  timezone: string;
  token: string;
  userPermissions: Array<string> = [];
  agreements: AgreementModel[];
  uuid: string;
  waitingList: boolean;
  userTitle: string;
  userPosition: string;
  projectTitle: string;
  activities: Array<ActivityModel>;
  certificationRequests: CertificationRequestModel[];
  certifications: UserCertificationModel[];
  sectionsVisited: string[];

  constructor(userRes?: UserResponseInterface) {
    if (userRes) {
      this.populateUser(userRes);
    }
  }

  /**
   * populate the user based on user response
   * @param userRes
   */
  populateUser( userRes: UserResponseInterface ): void {
    Object.assign(this, userRes);
    this.pk = userRes.pk ? userRes.pk.toString() : userRes.id ? userRes.id.toString() : userRes.uuid;

    if (userRes.profilePicture) {
      this.profilePictures.push(
        ...userRes.profilePicture
          .map(pic => new UserPictureModel({ height: pic[0][0], width: pic[0][1], url: pic[1] }))
      );
    }

    if (userRes.profilePictures && !userRes.profilePicture) {
      this.profilePictures.push(
        ...userRes.profilePictures
          .map(pic => new UserPictureModel({ height: pic[0][0], width: pic[0][1], url: pic[1] }))
      );
    }

    if (userRes.profilePictures) {
      this.profilePictures.push(...userRes.profilePictures.map(pic => new UserPictureModel(pic)));
    }

    this.language = userRes.platformLanguage;
    this.lastLogin = MomentTZ(userRes.lastLogin);
    this.pkConsultant = userRes.consultantId ? userRes.consultantId.toString() : undefined;

    this.timezone = userRes.timezone || MomentTZ.tz.guess();
    this.activities = userRes.desiredActivities ?
      userRes.desiredActivities.map(act => <ActivityModel> {name: act}) : [] ;

    if (userRes.groups) {
      this.waitingList = userRes.groups.map( x => x.name ).includes( 'waiting_list' );
    }

    this.userTitle = userRes.userTitle ? userRes.userTitle : '';
    this.agreements = userRes.userAgreements ? userRes.userAgreements.map(
      userAgreement => new AgreementModel(userAgreement.agreement)
    ) : [];
    this.sectionsVisited = userRes.sectionsVisited || ['opportunities'];
    this.certifications = userRes.certifications ? this.parseCertifications(userRes.certifications) : [];
  }

  private parseCertifications(certifications: Array<any>): Array<UserCertificationModel> {
    return certifications.map(certification => {
      const certificates = certification.certificates.map(certificate => {
        return new CertificateModel(
          certificate.name,
          certificate.pdf,
          certificate.accredibleUrl,
          certificate.image,
          MomentTZ(certificate.issueOn).utc());
      });
      return new UserCertificationModel(
        certification.code,
        certification.name,
        certification.description,
        certification.level,
        certificates);
    });
  }

  isAuthenticated(): boolean { return this.token !== ''; }

  /**
   * return the profile picture based on the size
   * @param size
   */
  getPicture(size: number): string | undefined {
    return getUserProfilePicture(size, this.profilePictures);
  }

  hasPermissionsSuperuserIncluded(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }

  hasPermissions(permission: string, object?: any): boolean {
    const permissionsList = object && object.permissions ? object.permissions : this.userPermissions;
    return this.isSuperuser ? true : permissionsList.includes(permission);
  }

  isConsultant(): boolean {
    return this.segment === segmentUserEnum.Consultant;
  }

  getIsActive(): boolean {
    return this.isActive && this.status === UserStatus.CH_ACTIVE;
  }

  hasVisited(section: string): boolean {
    return this.sectionsVisited.includes(section);
  }

  isCertifiedIn(certification: CertificationModel): boolean {
    return this.certifications.some((cert: UserCertificationModel) => cert.code === certification.code);
  }

  isCertifiedInCode(certification: CertificationEnum): boolean {
    return this.certifications.some((cert: UserCertificationModel) => cert.code === certification);
  }

  getCertificates(certification: CertificationModel): CertificateModel[] {
    return this.certifications.find(cert => cert.code === certification.code).certificates;
  }

  hasMinimunCertification(certification: CertificationModel): boolean {
    return this.certifications.some(cert => cert.level >= certification.level);
  }

  isPending(code: CertificationEnum): boolean {
    return this.certificationRequests.find((c: any) => c.certificationCode === code) !== undefined;
  }
}
