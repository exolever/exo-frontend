import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PickerFileMetadata } from 'filestack-js/build/main/lib/picker';

import { AppState } from '@core/store/reducers';
import { map, filter } from 'rxjs/operators';
import {
  InformationBlockTarget, InformationBlock
} from '@service/shared/modules/information-block/models/information-block.model';
import { Assignment } from '@service/shared/models/assignment.model';
import { Task } from '@service/shared/modules/tasks/models/task.model';
import * as fromService from '@service/generic-project/store/reducer';
import * as deliverableActions from '@service/shared/deliverable.actions';
import { Resource } from '@applications/ecosystem-media-library/store/resource.model';
import { ResourceActions } from '@applications/ecosystem-media-library/ecosystem-media-library.conf';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { RoleEnum } from '@core/modules/roles/enums/role.enum';

import * as StepActions from '../../../store/actions/steps.actions';

@Component({
  templateUrl: './assignment-deliver.component.html'
})
export class AssignmentDeliverContainerComponent implements OnInit, OnDestroy {
  step$: Observable<StepModel>;
  assignment$: Observable<Assignment>;
  blocks$: Observable<InformationBlock[]>;
  uploading$: Observable<boolean>;
  role$: Observable<RoleEnum>;
  stepSelected: StepModel;
  subscription = new Subscription();
  teamPk;
  projectPk;
  stepPk;
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamPk = params.pkTeam;
      this.projectPk = params.pkService;
      this.stepPk = params.pk;
    });

    this.step$ = this.store.pipe(select(state => fromService.getStepSelected(state.genericProject)));
    this.assignment$ = this.store.pipe(
      select(state => fromService.selectFirstAssignment(state.genericProject)),
      filter((assignment: Assignment) => assignment !== undefined && assignment !== null)
    );
    this.blocks$ = this.assignment$.pipe(
      map((assignment: Assignment) => assignment.blocks),
      map((blocks: InformationBlock[]) => blocks.filter(b => b.section === InformationBlockTarget.Deliver) || [])
    );
    this.uploading$ = this.store.pipe(select(state => fromService.selectUploadingDeliverable(state.genericProject)));
    this.subscription.add(this.step$.subscribe(step => this.stepSelected = step));

    this.role$ = this.store.pipe(select(state => fromService.selectHeadCoachOrTeamRole(state.genericProject)));
  }

  sendToBackend(file: PickerFileMetadata) {
    this.store.dispatch(new deliverableActions.UploadDeliverable({ stepSelected: this.stepSelected, file: file}));
  }


  onMarkAllAsTodo(tasks: Task[]): void {
    this.store.dispatch(new StepActions.MarkManyGProjectTaskAsToDo({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      tasks: <Task[]>tasks
    }));
  }

  onMarkAllAsDone(tasks: Task[]): void {
    this.store.dispatch(new StepActions.MarkManyGProjectTaskAsDone({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      tasks: <Task[]>tasks
    }));
  }

  onMarkAsDone(task: Task): void {
    this.store.dispatch(new StepActions.MarkOneGProjectTaskAsDone({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      task: <Task>task
    }));
  }

  onMarkAsTodo(task: Task): void {
    this.store.dispatch(new StepActions.MarkOneGProjectTaskAsToDo({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      task: <Task>task
    }));
  }

  onManageDeliverable(data: {action: ResourceActions, resource: Resource}) {
    switch ( data.action ) {
      case ResourceActions.DELETE:
        this.store.dispatch(new deliverableActions.DeleteDeliverable({
          stepSelected: this.stepSelected,
          file: data.resource
        }));
      break;
      case ResourceActions.CHANGE_VISIBILITY:
        this.store.dispatch(new deliverableActions.ChangeDeliverablePrivacy({
          stepSelected: this.stepSelected,
          file: data.resource
        }));
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
