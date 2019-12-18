export enum CertificateEnum {
  FOUNDATION = 'CFO',
  CONSULTANT = 'CCO',
  SPRINT_COACH = 'CSC',
  AMBASSADOR = 'CEA',
  TRAINER = 'CTR',
  BOARD_ADVISOR = 'CBA',
}

export interface Certificate {
  name: string;
  code: CertificateEnum;
}

export interface UserPictureInterface {
  height: number;
  width: number;
  url: string;
}

export interface PeopleInterface {
  fullName: string;
  userTitle: string;
  location: string;
  certifications: Certificate[];
  profilePictures: UserPictureInterface[];
  slug: string;
  languages: string;
}

export interface SearchTermInterface {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ResultInterface {
  count: number;
  results: PeopleInterface[];
}
