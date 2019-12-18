import * as MomentTZ from 'moment-timezone';

export interface IResource {
  pk: string;
  created: MomentTZ.Moment;
  modified: MomentTZ.Moment;
  name: string;
  link: string;
  isLink: boolean;
  isFile: boolean;
  type: string;
  url: string;
  mimetype: string;
  extension: string;
  publicTags: Array<string>;
}
