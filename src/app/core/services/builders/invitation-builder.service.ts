import { Injectable } from '@angular/core';

import { NodeModel } from '../apollo/models/node.model';

@Injectable()
export class InvitationBuilderService {

  InvitationBuild(node: NodeModel): NodeModel {
    node.addFields(['extraData', 'invStatus', 'invType']);
    return node;
  }

}
