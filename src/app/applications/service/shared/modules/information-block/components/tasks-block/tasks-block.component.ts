import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Task } from '@applications/service/shared/modules/tasks/models';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject} from '@applications/workspace/projects/models/step.model';
import { InformationBlock } from '../../models/information-block.model';


@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.scss']
})
export class TasksBlockComponent implements OnInit {
  @Input() taskBlock: InformationBlock;
  @Input() assignment: any;
  @Input() step: Step | StepGProject;
  @Input() hasAllDone: boolean;
  @Output() markAllAsTodo = new EventEmitter<Task[]>();
  @Output() markAllAsDone = new EventEmitter<Task[]>();
  @Output() markAsTodo = new EventEmitter<Task>();
  @Output() markAsDone = new EventEmitter<Task>();
  projectPk: string;
  teamPk: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectPk = this.route.parent.parent.snapshot.paramMap.get('pkService');
    this.teamPk = this.route.parent.parent.snapshot.paramMap.get('pkTeam');
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

  onMarkAsToDo(task: Task): void {
    this.markAsTodo.emit(task);
  }
}
