import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import {
  InformationBlock
} from '@applications/service/shared/modules/information-block/models/information-block.model';

import { Assignment } from '@applications/service/shared/models';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject} from '@applications/workspace/projects/models/step.model';
import { Task } from '@applications/service/shared/modules/tasks/models/task.model';

@Component({
  selector: 'app-assignment-learn',
  templateUrl: './assignment-learn.component.html',
  styleUrls: ['./assignment-learn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentLearnComponent {
  @Input() assignment: Assignment;
  @Input() blocks: InformationBlock[];
  @Input() step: Step | StepGProject;
  @Output() markAllAsTodo = new EventEmitter<Task[]>();
  @Output() markAllAsDone = new EventEmitter<Task[]>();
  @Output() markAsTodo = new EventEmitter<Task>();
  @Output() markAsDone = new EventEmitter<Task>();

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
