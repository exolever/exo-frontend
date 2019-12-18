import * as MomentTZ from 'moment-timezone';
import { UserModel } from '@app/core';
import { KeywordModel } from './../../shared/models/keyword.model';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';


export enum AnswerStatus {
  DRAFT = 'D',
  PUBLISHED = 'P',
  REMOVED = 'R',
  BLOCKED = 'B',
}
export class Answer {
  pk: number;
  comment: string;
  createdBy: UserModel;
  created: MomentTZ.Moment;
  modified: MomentTZ.Moment;
  tags: Array<KeywordModel>;
  uploadedFiles: Array<FilestackUploadInterface>;
  status: AnswerStatus;
  canEdit: boolean;
  canVote: boolean;
  avgRating: number;
  yourRating: number;
  counterRating: number;
  seen: boolean;
  numLikes: number;
  liked: boolean;

  constructor(obj) {
    Object.assign(this, obj);
    this.created = obj.created ? MomentTZ(obj.created) : undefined;
    this.modified = obj.modified ? MomentTZ(obj.modified) : undefined;
  }
}
