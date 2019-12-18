import { InformationBlock } from '../../information-block/models/information-block.model';

export enum TaskStatus {
  ToDo = <any>'T',
  Done = <any>'D'
}

export interface ITask {
  pk: string;
  name: string;
  order: number;
  status: TaskStatus;
  blocks: Array<InformationBlock>;
}

export class Task implements ITask {
  pk: string;
  name: string;
  order: number;
  status: TaskStatus;
  blocks: Array<InformationBlock>;

  constructor(obj: ITask) {
    Object.assign(this, obj);
    this.pk = this.pk ? this.pk.toString() : undefined;
    this.blocks = obj.blocks.map(block => new InformationBlock(block));
  }

  isToDo(): boolean {
    return this.status === TaskStatus.ToDo;
  }

  isDone(): boolean {
    return this.status === TaskStatus.Done;
  }
}
