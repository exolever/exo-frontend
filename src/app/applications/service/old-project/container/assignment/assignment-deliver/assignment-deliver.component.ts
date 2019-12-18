import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PickerFileMetadata } from 'filestack-js/build/main/lib/picker';

import { AppState } from '@core/store/reducers';
import { map, filter } from 'rxjs/operators';
import {
  InformationBlockTarget, InformationBlock
} from '@applications/service/shared/modules/information-block/models/information-block.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';
import * as fromSteps from '@service/old-project/store/reducers';
import * as deliverableActions from '@service/shared/deliverable.actions';
import { Task } from '@applications/service/shared/modules/tasks/models/task.model';
import { Resource } from '@applications/ecosystem-media-library/store/resource.model';
import { ResourceActions } from '@applications/ecosystem-media-library/ecosystem-media-library.conf';
import * as fromProjects from '@applications/service/old-project/store/project';

import * as StepActions from '../../../store/steps/step.actions';
import { Step } from '../../../models/step.model';
import { Assignment } from '../../../../shared/models';


@Component({
  templateUrl: './assignment-deliver.component.html'
})
export class AssignmentDeliverContainerComponent implements OnInit, OnDestroy {
  step$: Observable<Step>;
  assignment$: Observable<Assignment>;
  blocks$: Observable<InformationBlock[]>;
  uploading$: Observable<boolean>;
  stepSelected: Step;
  subscription = new Subscription();
  teamPk;
  projectPk;
  stepPk;
  role$: Observable<string | SprintRoleEnum>;

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

    this.step$ = this.store.pipe(select(fromSteps.getStepSelected));
    this.assignment$ = this.store.pipe(
      select(fromSteps.getFirstAssignment),
      filter((assignment: Assignment) => assignment !== undefined && assignment !== null)
    );
    this.blocks$ = this.assignment$.pipe(
      map((assignment: Assignment) => assignment.blocks),
      map((blocks: InformationBlock[]) => blocks.filter(b => b.section === InformationBlockTarget.Deliver) || [])
    );
    this.uploading$ = this.store.pipe(select(fromSteps.isUploadingDeliverable));
    this.subscription.add(this.step$.subscribe(step => this.stepSelected = step));
    this.role$ = this.store.pipe(select(state => fromProjects.selectHeadCoachOrTeamRole(state)));
  }

  sendToBackend(file: PickerFileMetadata) {
    this.store.dispatch(new deliverableActions.UploadDeliverable({ stepSelected: this.stepSelected, file: file}));
  }

  onMarkAllAsTodo(tasks: Task[]): void {
    this.store.dispatch(new StepActions.MarkManyTaskAsToDo({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      tasks: <Task[]>tasks
    }));
  }

  onMarkAllAsDone(tasks: Task[]): void {
    this.store.dispatch(new StepActions.MarkManyTaskAsDone({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      tasks: <Task[]>tasks
    }));
  }

  onMarkAsDone(task: Task): void {
    this.store.dispatch(new StepActions.MarkOneTaskAsDone({
      stepPk: this.stepPk,
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      task: <Task>task
    }));
  }

  onMarkAsTodo(task: Task): void {
    this.store.dispatch(new StepActions.MarkOneTaskAsToDo({
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
