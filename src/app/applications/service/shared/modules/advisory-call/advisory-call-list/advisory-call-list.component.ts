import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppState } from '@core/store/reducers';
import * as fromOpportunities from '@opportunities/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import * as opportunitiesActions from '@opportunities/store/actions/opportunities.action';
import { GenericProject } from '@applications/workspace/projects/models/project.model';

import { AdvisoryCallService } from '../../../../shared/services/advisory-call.service';

@Component({
  templateUrl: './advisory-call-list.component.html',
  styleUrls: ['./advisory-call-list.component.scss']
})
export class AdvisoryCallListComponent implements OnInit, OnDestroy {
  opportunities$: Observable<OpportunityModel[]>;
  loading$: Observable<boolean>;
  emptyMoment$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalOpportunities$: Observable<number>;
  totalAdvisoryCall: number;
  consumedAdvisoryCall: number;
  sizeOpportunitiesList: number;
  private subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private advisoryCallService: AdvisoryCallService
  ) { }

  ngOnInit() {
    // If the user user change the selected team we need to reload the information
    if (!this.isGenericProjectDraft()) {
      this.route.params.subscribe(params => {
        this.loadAdvisoryCallSettings(this.route.snapshot.data.teamSelected.groupUuid);
      });
    }
  }

  loadAdvisoryCallSettings(groupUuid: string, getData = true) {
    this.subscription.add(
      this.advisoryCallService.getAdvisoryCallSettings(groupUuid).subscribe(
        data => {
          this.totalAdvisoryCall = data.total;
          this.consumedAdvisoryCall = data.consumed;
          if (getData) {
            this.getData(data.pk);
          }
        }
      )
    );
  }

  getData(groupPk: string) {
    this.store.dispatch(new opportunitiesActions.LoadAdvisoryCall(+groupPk));
    this.opportunities$ = this.store.pipe(
      select((state) => fromOpportunities.selectOpportunitiesAdmin(state.opportunities))
    );
    this.loading$ = this.store.pipe(
      select((state) => fromOpportunities.selectAdminIsLoading(state.opportunities)));
    this.emptyMoment$ = this.store.pipe(
      select((state) => fromOpportunities.selectAdminEmptyMoment(state.opportunities)));
    this.pageIndex$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminPageIndex(state.opportunities)));
    this.pageSize$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminPageSize(state.opportunities)));
    this.totalOpportunities$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminCount(state.opportunities)));
    this.recalculateAdvisoryCallSettings();
  }

  getRemaining(): number {
    return this.totalAdvisoryCall !== undefined && this.consumedAdvisoryCall !== undefined ?
      this.totalAdvisoryCall - this.consumedAdvisoryCall :
      0;
  }

  recalculateAdvisoryCallSettings() {
    // If the opportunitiesList change we need to check the available advisoryCalls without reload the data
    this.subscription.add(
      this.opportunities$.subscribe(opportunitiesList => {
        if (this.sizeOpportunitiesList && this.sizeOpportunitiesList !== opportunitiesList.length) {
          this.loadAdvisoryCallSettings(this.route.snapshot.data.teamSelected.groupUuid, false);
        }
        this.sizeOpportunitiesList = opportunitiesList.length;
      })
    );
  }

  onNewRequest() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  isGenericProjectDraft () {
    const project = this.route.snapshot.data.project;
    return project instanceof GenericProject && project.isADraft();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
