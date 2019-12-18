import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Assignment } from '@service/shared/models';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject } from '@applications/workspace/projects/models/step.model';
import { InformationBlockType, InformationBlock } from '../../models/information-block.model';
import { ResourceType } from '@ecosystem-media-library/store/resource.model';
import { Task } from '../../../tasks/models/task.model';
@Component({
  selector: 'app-information-block',
  templateUrl: './information-block.component.html'
})
export class InformationBlockComponent {
  @Input() block: InformationBlock;
  @Input() assignment: Assignment;
  @Input() step: Step | StepGProject;
  @Output() markAllAsTodo = new EventEmitter<Task[]>();
  @Output() markAllAsDone = new EventEmitter<Task[]>();
  @Output() markAsTodo = new EventEmitter<Task>();
  @Output() markAsDone = new EventEmitter<Task>();

  informationBlockEnum = InformationBlockType;

  constructor( ) { }

  hasAllDone(): boolean {
    return this.block.contents.filter((task: Task) => task.isToDo()).length === 0;
  }

  isVideo(block: InformationBlock): boolean {
    return block.contents && block.contents.length > 0 ? block.contents[0]['type'] === ResourceType.Video : false;
  }

  onMarkAllAsTodo(tasks: Task[]): void {
    this.markAllAsTodo.emit(tasks);
  }

  onMarkAllAsDone(tasks: Task[]): void {
    this.markAllAsDone.emit(tasks);
  }

  onMarkAsDone(task: Task): void {
    this.markAsDone.emit(task);
  }

  onMarkAsTodo(task: Task): void {
    this.markAsTodo.emit(task);
  }

}
