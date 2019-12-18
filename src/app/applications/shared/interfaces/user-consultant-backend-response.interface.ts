import { BadgeResponseInterface } from '@applications/shared/interfaces/badge.interface';
import { UserCertificationResponseInterface } from '@applications/shared/interfaces/certification.interface';

export interface IUserApplicationBackendResponse {
  /** from the response */
  pk: string;
  uuid: string;
  shortName: string;
  fullName: string;
  slug: string;
  email: string;
  // emailContact: any;
  phone: any;
  position: string;
  profilePictures: { width: number,  height: number, url: string }[];
  location: string;
  placeId: string;
  timezone: string;
  shortMe: string;
  aboutMe: string;
  bioMe: string;
  dateJoined: string;
  passwordUpdated: boolean;
  permissions: Array<string>;
  socialNetworks:  any;
  roles?: IRoleFieldResponse[];
  userTitle: string;
  userPosition: string;
  numProjects: number;
  badgesActivity: Array<BadgeResponseInterface>;
  certifications: Array<UserCertificationResponseInterface>;
}

export interface IConsultantBackendResponse extends IUserApplicationBackendResponse {
  consultant: IConsultantFieldResponse;
}

interface IConsultantFieldResponse {
  exoAreas: Array<{exoArea: {code: string}}>;
  exoAttributes: { pk: string, level: number, exoAttribute: { name: string, Type: string}[] }[];
  exoProfile: IExoProfileFieldResponse;
  id: string;
  certifications: Array<UserCertificationResponseInterface>;
  industries: { level: number, industry: { name: string, id: string } }[];
  keywords: { level: number, keyword: { name: string,  tags: any }}[];
  languages: { name: string,  id: string }[];
  permissions: number;
  pk: string;
  roles: IRoleFieldResponse[];
}

interface IExoProfileFieldResponse {
  mtpMastery: number;
  personalMtp: string;
  areasExpertise: any;
  availability: string;
  availabilityHours: any;
  exoActivities: { exoActivity: IExoActivityFieldResponse, status: string }[];
  wantedRoles: Array<string>;
  videoUrl: any;
}

interface IExoActivityFieldResponse {
  code: string;
  description: string;
  name: string;
  order:  number;
  requireCertification: boolean;
}

interface IRoleFieldResponse {
  badge: { status: string };
  project: IProjectFieldResponse;
  rating: number;
  role: {name: string, code: string};
  roleName: string;
  status: string;
}

export interface IProjectFieldResponse {
  customer: { name: string };
  firstDay: string;
  name: string;
  pk: string;
  start: string;
  status: string;
  typeProject: string;
}
