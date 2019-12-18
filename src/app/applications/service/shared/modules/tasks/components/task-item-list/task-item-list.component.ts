import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Task } from '@applications/service/shared/modules/tasks/models';

import { ShowTaskComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-item-list',
  templateUrl: './task-item-list.component.html',
  styleUrls: ['./task-item-list.component.scss']
})
export class TaskItemListComponent implements OnInit {
  projectPk: string;
  teamPk: string;
  stepPk: string;

  @Input() task: Task;

  @Output()
  onMarkAsDone: EventEmitter<any> = new EventEmitter();

  @Output()
  onMarkAsToDo: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.projectPk = params.get('pkService');
      this.teamPk = params.get('pkTeam');
      this.stepPk = params.get('pk');
    });
  }

  markAsDone() {
    this.onMarkAsDone.emit(this.task);
  }

  markAsToDo() {
    this.onMarkAsToDo.emit(this.task);
  }

  showTask(event) {
    if (!event.target.classList.contains('mat-icon')) {
      if (this.task.blocks.length > 0) {
        this.router.navigate([`task/${this.task.pk}`], {relativeTo: this.route.parent});
      } else {
        this.matDialog.open(ShowTaskComponent, {
          data: { task: this.task }
        });
      }
    }
  }
}
