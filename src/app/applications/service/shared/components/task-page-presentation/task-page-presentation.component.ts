import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

import { Assignment } from '@applications/service/shared/models/assignment.model';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject } from '@applications/workspace/projects/models/step.model';
import { Task } from '@applications/service/shared/modules/tasks/models';

import { HeaderAssignmentService } from '../../services/header-assignment.service';

@Component({
  selector: 'app-task-page-presentation',
  templateUrl: 'task-page-presentation.component.html',
  styleUrls: ['task-page-presentation.component.scss']
})
export class TaskPagePresentationComponent implements OnInit, OnDestroy {
  @Input() projectPk: string;
  @Input() teamPk: string;
  @Input() task: Task;
  @Input() assignment: Assignment;
  @Input() step: Step | StepGProject;
  @Output() done = new EventEmitter<Task>();
  @Output() toDo = new EventEmitter<Task>();

  constructor(
    private headerAssignmentService: HeaderAssignmentService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.headerAssignmentService.hideAssignmentHeader();
  }

  onMarkAsDone(task) {
    this.done.emit(task);
  }

  onMarkAsToDo(task) {
    this.toDo.emit(task);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.headerAssignmentService.showAssignmentHeader();
  }
}



