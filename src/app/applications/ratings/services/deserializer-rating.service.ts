import { Injectable } from '@angular/core';

import { UserApplicationModel } from '@applications/shared/models/user-application.model';
import { removeEdges } from '@shared/helpers/removeEdges.helper.ts';

import { OverallRatingModel, RatingModel } from '@ratings/models';

@Injectable()
export class DeserializerRatingService {

  deserializeOverallRating(overallRatingNode): OverallRatingModel {
    const overallRating = new OverallRatingModel(overallRatingNode.pk);
    if (overallRatingNode.hasOwnProperty('rating')) {
      overallRating.rating = overallRatingNode.rating;
    }
    if (overallRatingNode.hasOwnProperty('category')) {
      overallRating.category = overallRatingNode.category;
    }
    if (overallRatingNode.hasOwnProperty('userStatus')) {
      overallRating.userStatus = overallRatingNode.userStatus;
    }
    const ratings = removeEdges(overallRatingNode.ratings).map(rating => {
      return this.deserializeRating(rating);
    });
    overallRating.setRatings(ratings);
    return overallRating;
  }

  deserializeRating(obj): RatingModel {
    const rating = new RatingModel(obj.pk);
    if (obj.hasOwnProperty('created')) {
      rating.created = obj.created;
    }
    if (obj.hasOwnProperty('rating')) {
      rating.rating = obj.rating;
    }
    if (obj.hasOwnProperty('comment')) {
      rating.comment = obj.comment;
    }
    if (obj.hasOwnProperty('category')) {
      rating.category = obj.category;
    }
    rating.user = this.deserializeUser(obj.user);
    return rating;
  }

  deserializeUser(obj): UserApplicationModel {
    let userApplication;
    userApplication = new UserApplicationModel(obj.pk);
    userApplication.email = obj.email;
    userApplication.shortName = obj.shortName;
    userApplication.fullName = obj.fullName;
    return userApplication;
  }
}
