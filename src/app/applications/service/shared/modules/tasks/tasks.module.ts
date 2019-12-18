import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ExoCommonModule } from '@shared/exo-common.module';
import { TaskItemListComponent } from './components/task-item-list/task-item-list.component';
import { TaskStatusComponent } from './components/task-status/task-status.component';
import { ShowTaskComponent } from './components/task-dialog/task-dialog.component';

@NgModule({
  imports: [
    ExoCommonModule,
    CommonModule,
    RouterModule
  ],
  declarations: [
    TaskItemListComponent,
    TaskStatusComponent,
    ShowTaskComponent
  ],
  exports: [
    TaskItemListComponent,
    TaskStatusComponent
  ],
  entryComponents: [
    ShowTaskComponent
  ]
})
export class TasksModule { }
