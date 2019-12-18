import { Injectable } from '@angular/core';

import { NodeModel } from '@core/services';


@Injectable()
export class ResourcesQueryBuilderService {

  public addResourcesNode(node: NodeModel): NodeModel {
    const resources = node.addMultipleNode('resources');
    resources.addFields(['created', 'modified', 'name', 'link',
      'isLink', 'isFile', 'type', 'url', 'publicTags ']);
    return resources;
  }
}
