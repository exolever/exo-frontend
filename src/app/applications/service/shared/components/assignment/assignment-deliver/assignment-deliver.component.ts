import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PickerFileMetadata } from 'filestack-js/build/main/lib/picker';

import { ResourceActions } from '@ecosystem-media-library/ecosystem-media-library.conf';
import {
  InformationBlock
} from '@service/shared/modules/information-block/models/information-block.model';
import { Assignment } from '@service/shared/models/assignment.model';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject } from '@applications/workspace/projects/models/step.model';
import { Resource } from '@applications/ecosystem-media-library/store/resource.model';
import { Task } from '@service/shared/modules/tasks/models';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models';
import { SprintRoleEnum } from '@core/modules/roles/enums';


@Component({
  selector: 'app-assignment-deliver',
  templateUrl: './assignment-deliver.component.html',
  styleUrls: ['./assignment-deliver.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AssignmentDeliverComponent implements OnInit, OnDestroy {
  @Input() step: Step | StepGProject;
  @Input() assignment: Assignment;
  @Input() blocks: InformationBlock[];
  @Input() uploading: boolean;
  @Input() role: SprintRoleEnum;
  @Output() sendToBackend = new EventEmitter<PickerFileMetadata>();
  @Output() markAllAsTodo = new EventEmitter<Task[]>();
  @Output() markAllAsDone = new EventEmitter<Task[]>();
  @Output() markAsTodo = new EventEmitter<Task>();
  @Output() markAsDone = new EventEmitter<Task>();
  @Output() manageDeliverable =  new EventEmitter<{action: ResourceActions, resource: Resource}>();
  subscription = new Subscription();
  user: UserModel;

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subscription.add(this.store.pipe(select(state => fromUser.getUser(state))).subscribe(
      user => this.user = user
    ));
  }

  onSendToBackend(file: PickerFileMetadata) {
    this.sendToBackend.next(file);
  }

  onManageActionsResource(data: {action: ResourceActions, resource: Resource}) {
    this.manageDeliverable.emit(data);
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

  allowShowActions(resource: Resource): boolean {
    // If it's the owner
    if (resource.createdBy && resource.createdBy.pk === this.user.pk) {
      return true;
    }
    // If it's coach/head coach
    return SprintRoleEnum.SPRINT_COACH_SPRINT === this.role ||
      SprintRoleEnum.HEAD_COACH_SPRINT === this.role;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
