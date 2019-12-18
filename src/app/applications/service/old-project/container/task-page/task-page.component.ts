import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { Assignment } from '@applications/service/shared/models';
import { Task } from '@applications/service/shared/modules/tasks/models';
import * as StepActions from '@applications/service/old-project/store/steps/step.actions';
import * as fromService from '@applications/service/old-project/store/reducers';
import * as fromStep from '@applications/service/old-project/store/steps/step.reducer';
import { Step } from '@service/old-project/models/step.model';

@Component({
  templateUrl: 'task-page.component.html',
  styleUrls: ['task-page.component.scss']
})
export class TaskPageContainerComponent implements OnInit {
  projectPk: string;
  teamPk: string;
  stepPk: string;
  task$: Observable<Task>;
  assignment$: Observable<Assignment>;
  step$: Observable<Step>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    observableCombineLatest(this.route.paramMap, this.route.parent.paramMap)
      .subscribe((params: ParamMap[]) => {
        this.task$ = this.store.pipe(
          select(state => fromStep.selectTask(state, this.stepPk, params[0].get('pkTask')))
        );
        this.assignment$ = this.store.pipe(select(fromService.getFirstAssignment));
        this.step$ = this.store.pipe(
          select(fromService.getStepSelected),
          tap(step => this.stepPk = step.pk));
        this.projectPk = params[0].get('pkService');
        this.teamPk = params[0].get('pkTeam');
      });
  }

  markAsDone(task: Task) {
    this.store.dispatch(new StepActions.MarkOneTaskAsDone({
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      stepPk: this.stepPk,
      task: task
    }));
  }

  markAsToDo(task: Task) {
    this.store.dispatch(new StepActions.MarkOneTaskAsToDo({
      projectPk: this.projectPk,
      teamPk: this.teamPk,
      stepPk: this.stepPk,
      task: task
    }));
  }
}



