import { RatingModel } from './rating.model';
import { RatingCategoryEnum } from '../enums/category';
import { RatingStatusEnum } from '../enums/rating';


export class OverallRatingModel {
  public rating: Number;
  public category: RatingCategoryEnum;
  public ratings: Array<RatingModel>;
  public userStatus: RatingStatusEnum;

  constructor(public pk: string) { }
  setRatings(ratings: Array<RatingModel>) {
    this.ratings = ratings;
  }
  getCategoryDisplay(): string {
    return RatingCategoryEnum[this.category];
  }
  isSkipped(): boolean {
    return this.userStatus === RatingStatusEnum['Skipped'];
  }
  isRating(): boolean {
    return this.userStatus === RatingStatusEnum['Done'];
  }
  isPending(): boolean {
    return this.userStatus === RatingStatusEnum['Not Rating Yet'];
  }
}
