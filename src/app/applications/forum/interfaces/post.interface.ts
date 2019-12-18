import { UserModel } from '@app/core';
import * as MomentTZ from 'moment-timezone';

import { KeywordModel } from './../../shared/models/keyword.model';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';


export class Post {
  pk: number;
  slug: string;
  title: string;
  description: string;
  createdBy: UserModel;
  created: MomentTZ.Moment;
  modified: MomentTZ.Moment;
  tags: Array<KeywordModel>;
  uploadedFiles: Array<FilestackUploadInterface>;
  answers: number;
  answersUnseen: number;
  seen: boolean;
  numViews: number;
  numLikes: number;
  liked: boolean;
  hasBeenEdited: boolean;

  constructor(obj) {
    Object.assign(this, obj);
    this.created = obj.created ? MomentTZ(obj.created) : undefined;
    this.modified = obj.modified ? MomentTZ(obj.modified) : undefined;
    if (this.uploadedFiles) {
      this.uploadedFiles
        .filter(file => file['filestackStatus'] !== undefined)
        .forEach(file => file.filestack_status = file['filestackStatus']);
    }
  }
}
