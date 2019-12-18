import { Resource } from '@ecosystem-media-library/store/resource.model';

import { InformationBlock } from '@service/shared/modules/information-block/models/information-block.model';

export interface IAssignment {
  pk?: string;
  name: string;
  blocks: Array<InformationBlock>;
  resources?: Array<Resource>;
  deliverables?: Array<Resource>;
}

export class Assignment implements IAssignment {
  pk?: string;
  name: string;
  blocks: Array<InformationBlock>;
  resources?: Array<Resource>;
  deliverables?: Array<Resource>;

  constructor(data: IAssignment) {
    Object.assign(this, data);
    this.pk = this.pk ? this.pk.toString() : undefined;
    this.resources = data.hasOwnProperty('resources') ? data.resources.map(r => new Resource(r)) : [];
    this.deliverables = data.hasOwnProperty('deliverables') ?
      data.deliverables.map(d => new Resource(d)) : [];
    this.blocks =  data.blocks.sort((a, b) => a.order < b.order ? -1 : 1).map(b => new InformationBlock(b));
  }
}
