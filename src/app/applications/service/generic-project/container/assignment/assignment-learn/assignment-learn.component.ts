import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';

import {
  InformationBlockTarget, InformationBlock
} from '@applications/service/shared/modules/information-block/models/information-block.model';
import { AppState } from '@core/store/reducers';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { Task } from '@applications/service/shared/modules/tasks/models/task.model';

import * as fromSteps from '../../../store/reducer';
import * as StepActions from '../../../store/actions/steps.actions';
import { Assignment } from '../../../../shared/models';

@Component({
  templateUrl: './assignment-learn.component.html'
})
export class AssignmentLearnContainerComponent implements OnInit {
  assignment$: Observable<Assignment>;
  blocks$: Observable<InformationBlock[]>;
  step$: Observable<StepModel>;
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

    this.assignment$ = this.store.pipe(
      select(state => fromSteps.selectFirstAssignment(state.genericProject)),
      filter((assignment: Assignment) => assignment !== undefined && assignment !== null),
    );

    this.blocks$ = this.assignment$.pipe(
      map((assignment: Assignment) => assignment.blocks),
      map((blocks: InformationBlock[]) => blocks.filter(b => b.section === InformationBlockTarget.Learn) || [])
    );

    this.step$ = this.store.pipe(select(state => fromSteps.getStepSelected(state.genericProject)));
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

}
