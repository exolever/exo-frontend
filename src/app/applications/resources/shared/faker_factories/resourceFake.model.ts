import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { IResource } from '../models';

export class FakeResourceFactory implements IResource {
  pk: string;
  created: any;
  modified: any;
  name: string;
  link: string;
  isLink: boolean;
  isFile: boolean;
  type: string;
  url: string;
  mimetype: string;
  extension: string;
  publicTags: Array<string>;

  constructor( obj?: any ) {
    this.pk = faker.random.number( 13 ) + '';
    this.created = MomentTZ();
    this.modified = MomentTZ();
    this.name = faker.random.word();
    this.link = faker.internet.url();
    this.isLink = true;
    this.isFile = false;
    this.type = faker.random.word();
    this.url = faker.internet.url();
    this.mimetype = faker.random.word();
    this.extension = faker.random.word();
    this.publicTags = [ faker.random.arrayElement(), faker.random.arrayElement() ];

    if ( obj ) {
      if ( typeof ( obj ) === 'object') {
        Object.assign( this, obj );
      }
    }
  }

}
