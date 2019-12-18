import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { Assignment } from '@service/shared/models';
import { Task } from '@service/shared/modules/tasks/models';
import * as StepActions from '@service/generic-project/store/actions/steps.actions';
import * as fromStore from '@service/generic-project/store/reducer';
import * as fromSteps from '@service/generic-project/store/reducer/steps.reducer';
import { StepModel } from '@applications/workspace/projects/models/step.model';

@Component({
  templateUrl: 'task-page.component.html',
  styleUrls: ['task-page.component.scss']
})
export class TaskPageContainerComponent implements OnInit {
  projectPk: number;
  teamPk: number;
  stepPk: number;
  taskPk: number;
  task$: Observable<Task>;
  assignment$: Observable<Assignment>;
  step$: Observable<StepModel>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectPk = +params.get('pkService');
      this.stepPk = +params.get('pk');
      this.teamPk = +params.get('pkTeam');
      this.taskPk = +params.get('pkTask');

      this.task$ = this.store.pipe(select(state => fromSteps.selectTask(state, this.stepPk, this.taskPk)));
      this.assignment$ = this.store.pipe(select(state => fromStore.selectFirstAssignment(state.genericProject)));
      this.step$ = this.store.pipe(select(state => fromStore.getStepSelected(state.genericProject)));
    });
  }

  markAsDone(task: Task) {
    this.store.dispatch(new StepActions.MarkOneGProjectTaskAsDone({
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      stepPk: this.stepPk,
      task: task
    }));
  }

  markAsToDo(task: Task) {
    this.store.dispatch(new StepActions.MarkOneGProjectTaskAsToDo({
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      stepPk: this.stepPk,
      task: task
    }));
  }
}



