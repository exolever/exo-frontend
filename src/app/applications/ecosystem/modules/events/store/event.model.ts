import * as MomentTZ from 'moment-timezone';
import { ConsultantModel } from '@applications/shared/models';
import {FollowTypeEnum, RoleMember, StatusTypeEnum, TypeEventEnum} from './event.enums';
import {UserStatus} from '@core/enums';

export class Event {
  comment?: string;
  domain?: string;
  end?:  MomentTZ.Moment;
  followType?: FollowTypeEnum;
  followTypeName?: string;
  isFree?: boolean;
  joinEnabled?: boolean;
  languages?: string[];
  language?: string;
  location?: string;
  participants?: Participant[];
  pk: string;
  placeId?: string;
  price?: string;
  profileUrl?: string;
  published?: boolean;
  sections?: Array<any>;
  showPrice?: boolean;
  slug?: string;
  start: MomentTZ.Moment;
  status?: StatusTypeEnum;
  timezone?: string;
  title: string;
  trainer?: any;
  category: TypeEventEnum;
  typeEventName?: string;
  url?: string;
  eventImage?: string;
  uuid: string;

  constructor(data: any) {
    Object.assign(this, data);
    this.start = data.start ? MomentTZ(data.start) : undefined;
    this.end = data.end ? MomentTZ(data.end) : undefined;
  }
  isRejected() {
    return this.status === StatusTypeEnum.REJECTED;
  }
  isPublished() {
    return this.status === StatusTypeEnum.PUBLIC;
  }
  isPending() {
    return this.status === StatusTypeEnum.PENDING;
  }
}

export interface Attendee {
  pk: string;
  name: string;
  email: string;
  certified?: boolean;
}

export interface Speaker {
  pk?: string;
  consultant: ConsultantModel;
  pkRol: string;
}

export interface Participant {
  fullName?: string;
  id?: number;
  order?: number;
  role: RoleMember;
  roleName: string;
  profileUrl?: string;
  status: UserStatus;
  thumbnail?: string;
  userEmail?: string;
  userTitle?: string;
  uuid: string;
}

export interface EventPermissionType {
  category: TypeEventEnum;
  typeEventName: string;
  available: boolean;
}


