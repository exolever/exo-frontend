import * as MomentTZ from 'moment-timezone';

import {KeywordModel} from '@applications/shared/models/keyword.model';

import {getValueEnum} from '@shared/helpers/enum.helper';
import { UserModel } from '@core/models';

export enum ResourceStatus {
  Draft = <any>'D',
  Available = <any>'A',
  Error = <any>'E'
}

export enum PrivacyType {
  Private= <any>'P',
  Public = <any>'G',
}

export enum ResourceType {
  Pdf = <any>'P',
  Document = <any>'D',
  Slides = <any>'S',
  Form = <any>'F',
  Spreadsheet = <any>'R',
  Video = <any>'V',
  Links = <any>'L',
  Image = <any>'I'
}

export const Hubs = [
  {code: 'E', label: 'PROJECT.SECTIONS.ECOSYSTEM', control: undefined},
  {code: 'A', label: 'PROJECT.SECTIONS.ALUMNI', control: undefined},
  {code: 'T', label: 'PROJECT.SECTIONS.CONSULTANT', control: undefined},
  {code: 'C', label: 'PROJECT.SECTIONS.COACH', control: undefined},
  {code: 'B', label: 'PROJECT.SECTIONS.AMBASSADOR', control: undefined},
  {code: 'R', label: 'PROJECT.SECTIONS.TRAINER', control: undefined},
  {code: 'I', label: 'PROJECT.SECTIONS.INVESTOR', control: undefined}
];

export interface IResource {
  pk: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  iframe?: string;
  description?: string;
  duration?: number;
  link?: string;
  created?: MomentTZ.Moment;
  tags?: Array<KeywordModel>;
  thumbnail?: string;
  internal?: boolean;
  actions?: Array<string>;
  sections?: Array<string>;
  mimetype?: string;
  visibility?: PrivacyType;
  createdBy?: any;
  canChangeVisibility?: boolean;
}

export class Resource implements IResource {
  pk: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  iframe?: string;
  description?: string;
  duration?: number;
  link?: string;
  created?: MomentTZ.Moment;
  tags?: Array<KeywordModel>;
  thumbnail?: string;
  internal?: boolean;
  actions?: Array<string>;
  sections?: Array<string>;
  mimetype?: string;
  visibility?: PrivacyType;
  canChangeVisibility?: boolean;
  createdBy?: UserModel;

  constructor(obj: IResource) {
    Object.assign(this, obj);
    this.tags = [];
    if (obj.tags) {
      obj.tags.forEach(tag => {
        const keyword = new KeywordModel(tag.name);
        keyword.pk = tag.pk.toString();
        this.tags.push(keyword);
      });
    }
    this.thumbnail = obj.thumbnail;
    this.mimetype = getValueEnum(ResourceType, this.type);
    if (obj.createdBy) {
      this.createdBy = new UserModel(obj.createdBy);
    }
  }

  isDraft(): boolean {
    return this.status === ResourceStatus.Draft;
  }

  isError(): boolean {
    return this.status === ResourceStatus.Error;
  }

  getOwnerAvatar(): string | undefined {
    return this.createdBy ?
      this.createdBy.profilePictures[0].hasOwnProperty('url') ?
        this.createdBy.profilePictures[0].url :
        this.createdBy.profilePictures[0][1] :
      undefined;
  }

  getOwnerName(): string | undefined {
    return this.createdBy ? this.createdBy.fullName : undefined;
  }

}

