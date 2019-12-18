import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@core/store/reducers';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import * as StepsActions from '@applications/workspace/projects/store/action/steps.action';
import { StepModel } from '@applications/workspace/projects/models/step.model';

import { StepEditionDialogComponent } from './step-edition-dialog/step-edition-dialog.component';

@Component({
  selector: 'app-project-steps',
  templateUrl: './project-steps.component.html',
  styleUrls: ['./project-steps.component.scss']
})
export class ProjectStepsComponent implements OnInit {
  steps$: Observable<StepModel[]>;
  loading$: Observable<boolean>;
  displayedColumns = ['name', 'start', 'actions'];
  projectPk: number;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.store.dispatch(new StepsActions.Load(params.projectPk));
      this.projectPk = params.projectPk;
    });

    this.loading$ = this.store.pipe(
      select(state => fromStore.stepsAreLoading(state.workspaceProjects)));

    this.steps$ = this.store.pipe(
      select(state => fromStore.selectAllSteps(state.workspaceProjects)));
  }

  onEdit(step: StepModel) {
    this.dialog.open(StepEditionDialogComponent, {
      data: { step: step, projectPk: this.projectPk }
    });
  }

}
