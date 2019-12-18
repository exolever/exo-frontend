import * as faker from 'faker';
import { FakeModel } from '@shared/faker_factories';

import { RatingCategoryEnum } from '../enums/category';
import { RatingStatusEnum } from '../enums/rating';
import { OverallRatingModel } from '../models/overallrating.model';
import { FakeRating } from './ratingFake.model';


export class FakeOverallRating extends FakeModel ( OverallRatingModel ) {

  constructor() {
    super(faker.random.number().toString());
    this.rating = faker.random.number();
    this.ratings = [new FakeRating(), new FakeRating()];
    this.category = RatingCategoryEnum.TICKET_ADVISOR;
    this.userStatus = RatingStatusEnum.N;
  }

}
