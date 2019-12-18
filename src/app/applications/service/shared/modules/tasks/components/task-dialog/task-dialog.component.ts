import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Task } from '@applications/service/shared/modules/tasks/models';

@Component({
  selector: 'app-show-task',
  templateUrl: './task-dialog.component.html'
})
export class ShowTaskComponent {

  task: Task;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShowTaskComponent>) {
    this.task = data.task;
  }
}
