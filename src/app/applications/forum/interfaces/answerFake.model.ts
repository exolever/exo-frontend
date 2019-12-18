import * as faker from 'faker';
import { FakeModel } from '@shared/faker_factories';
import * as MomentTZ from 'moment-timezone';

import { FakeUserModelFactory } from '@core/faker_factories';
import { UserModel } from '@core/models/user/user.model';
import { Answer, AnswerStatus } from './answer.interface';

export class FakeAnswerFactory extends FakeModel(Answer) {

  constructor(
    public pk: number = faker.random.number(),
    public comment: string = faker.random.words(),
    public createdBy: UserModel = new FakeUserModelFactory().modelPropertiesCustom([
      {
      name: 'profilePictures',
      data: [{}, {url: ''}]
      }
    ]),
    public created: MomentTZ.Moment = MomentTZ(),
    public modified: MomentTZ.Moment = MomentTZ(),
    public tags: Array<any> = [],
    public uploadedFiles: Array<any> = [],
    public status = AnswerStatus.PUBLISHED,
    public answersUnseen = 0,
    public canEdit = false,
    public canVote = false,
    public avgRating = 0,
    public yourRating = 0,
    public counterRating = 0,
    public seen = false,
    public numViews = 0,
    public numLikes = 0,
    public liked = false
  ) {
    super(<Answer>{
      pk,
      comment,
      createdBy,
      created,
      modified,
      tags,
      uploadedFiles,
      status,
      answersUnseen,
      canEdit,
      canVote,
      avgRating,
      yourRating,
      counterRating,
      seen,
      numViews,
      numLikes,
      liked
    });
  }

}
