import { Resource, IResource, ResourceType } from '@ecosystem-media-library/store/resource.model';

import { Task, ITask } from '../../tasks/models/task.model';
import { AdviceModel } from './advice.model';
import { TextModel } from './text.model';


export enum InformationBlockType {
  Resource = <any>'R',
  Task = <any>'T',
  Video = <any>'V',
  Advice = <any>'A',
  Text = <any>'E'
}

export enum InformationBlockTarget {
  Learn = <any>'L',
  Deliver = <any>'D',
  Reflect = <any>'R'
}

export type Content = Resource | Task | AdviceModel | TextModel | string;

export interface InformationBlockI {
  pk: string;
  order: number;
  type: InformationBlockType;
  contents: Array<Content>;
  title?: string;
  subtitle?: string;
  layout?: string;
  section?: InformationBlockTarget;
}

export class InformationBlock implements InformationBlockI {
  pk: string;
  order: number;
  type: InformationBlockType;
  contents: Array<Content>;
  title?: string;
  subtitle?: string;
  layout?: string;
  section?: InformationBlockTarget;

  constructor(data: InformationBlockI) {
    Object.assign(this, data);
    this.pk = this.pk ? this.pk.toString() : undefined;
    data.contents.sort((a, b) =>
      a.hasOwnProperty('order') && b.hasOwnProperty('order') && (a['order'] < b['order']) ? -1 : 1
    );
    this.contents = data.contents.map((content: Content) => {
      switch (this.type) {
        case InformationBlockType.Task:
          return new Task(<ITask>content);
        case InformationBlockType.Resource:
          return new Resource(<IResource>content);
        case InformationBlockType.Text:
          return content.hasOwnProperty('text') ? content['text'] : content;
        default:
          return content;
      }
    });

    if (this.contents.every(content => content['type'] === ResourceType.Video)) {
      this.type = InformationBlockType.Video;
    }
  }

}
