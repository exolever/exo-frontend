import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { Urls } from '@app/core';
import { AppState } from '@core/store/reducers';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { GenericProject } from '@applications/workspace/projects/models/project.model';

import * as fromStore from '../../store/reducer';
import * as stepActions from '../../store/actions/steps.actions';

@Component({
  templateUrl: './assignment.component.html'
})
export class AssignmentContainerComponent implements OnInit, OnDestroy {
  project: GenericProject;
  selectedStep$: Observable<StepModel>;
  loading$: Observable<boolean>;
  showHeader$: Observable<boolean>;
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.project = this.route.snapshot.data.project;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new stepActions.LoadGProjectStep({
        pkService: +params.get('pkService'),
        pkTeam: +params.get('pkTeam'),
        pkStep: +params.get('pk')
      }));
    });

    this.loading$ = this.store.pipe(
      select(state => fromStore.selectLoadingSteps(state.genericProject)));

    this.selectedStep$ = this.store.pipe(
      select(state => fromStore.getStepSelected(state.genericProject)),
      filter(step => step !== undefined && step !== null),
      tap((step: StepModel) => {
        if (this.router.url.replace(/[0-9]+/g, '%s') === Urls.GENERIC_STEP) {
          const firstAvailableTab = step.enabledLearn ? 'learn' : step.enabledDeliver ? 'deliver' : 'reflect';
          this.router.navigate([firstAvailableTab], { relativeTo: this.route });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
