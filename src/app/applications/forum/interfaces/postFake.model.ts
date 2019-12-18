import * as faker from 'faker';
import { FakeModel } from '@shared/faker_factories';
import * as MomentTZ from 'moment-timezone';

import { FakeUserModelFactory } from '@core/faker_factories';
import { Post } from './post.interface';


export class FakePostFactory extends FakeModel(Post) {

  constructor() {
    super({
      pk: faker.random.number().toString(),
      slug: faker.random.word(),
      title: faker.random.words(),
      description: faker.random.words(),
      createdBy: new FakeUserModelFactory().modelPropertiesCustom([
        {
        name: 'profilePictures',
        data: [{}, {url: ''}]
        }
      ]),
      created: MomentTZ(),
      modified: MomentTZ(),
      tags: [],
      uploadedFiles: [],
      answers: [],
      answersUnseen: 0,
      seen: true,
      numViews: 0,
      numLikes: 0,
      liked: false,
      hasBeenEdited: false
    });
  }

}
