import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { Urls } from '@core/services';
import { AppState } from '@core/store/reducers';

import { Step } from '../../models/step.model';
import * as fromSteps from '../../store/reducers';
import * as stepActions from '../../store/steps/step.actions';
import { ProjectModel } from '../../models/project.model';


@Component({
  templateUrl: './assignment.component.html'
})
export class AssignmentContainerComponent implements OnInit, OnDestroy {
  project: ProjectModel;
  selectedStep$: Observable<Step>;
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
      this.subscriptions.add(this.store.pipe(select(fromSteps.getStepsLoaded)).subscribe((loaded: boolean) => {
        // Don't dispatch individual step before steps entities was loaded.
        if (loaded) {
          this.store.dispatch(new stepActions.LoadStep({
            pkService: params.get('pkService'),
            pkTeam: params.get('pkTeam'),
            pkStep: params.get('pk')
          }));
        }
      }));
    });

    this.loading$ = this.store.pipe(select(state => fromSteps.isLoading(state.service)));

    this.selectedStep$ = this.store.pipe(
      select(fromSteps.getStepSelected),
      filter(step => step !== undefined && step !== null),
      tap((step: Step) => {
        if (this.router.url.replace(/[0-9]+/g, '%s') === Urls.STEP) {
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
