import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Task } from '../../models';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss']
})
export class TaskStatusComponent {
  @Input() task: Task;

  @Output()
  done: EventEmitter<any> = new EventEmitter();

  @Output()
  toDo: EventEmitter<any> = new EventEmitter();

  constructor() { }

  markAsDone() {
    this.done.emit(this.task);
  }

  markAsToDo() {
    this.toDo.emit(this.task);
  }
}
