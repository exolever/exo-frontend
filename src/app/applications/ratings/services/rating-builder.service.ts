import { Injectable } from '@angular/core';

import { NodeModel } from '@core/services/apollo/models/node.model';


@Injectable()
export class RatingBuilderService {

  buildRating(ratingsNode: NodeModel): NodeModel {
    ratingsNode.addFields(['pk', 'rating', 'comment', 'category']);
    const userNode = ratingsNode.addSingleNode('user');
    userNode.addFields(['pk', 'fullName', 'shortName', 'email']);
    return ratingsNode;
  }

  buildOverallRating(node: NodeModel): NodeModel {
    const ratingsNode = node.addMultipleNode('overallRatings');
    ratingsNode.addFields(['pk', 'rating', 'category', 'userStatus']);
    const ratings = ratingsNode.addMultipleNode('ratings');
    this.buildRating(ratings);
    return node;
  }

  buildAdvisorRating(node: NodeModel): NodeModel {
    const ratingsNode = node.addMultipleNode('advisorRatings');
    ratingsNode.addFields(['pk', 'rating', 'category', 'userStatus']);
    const ratings = ratingsNode.addMultipleNode('ratings');
    this.buildRating(ratings);
    return node;
  }

}
