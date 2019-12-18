import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { tap, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { AppState } from '@core/store/reducers';
import * as opportunitiesAdminActions from '@opportunities/modules/admin/store/actions/opportunities-admin.action';
import * as fromOpportunities from '@opportunities/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import { AdvisoryCallService } from '@applications/service/shared/services/advisory-call.service';
import { Urls, UrlService } from '@core/services';

@Component({
  templateUrl: './advisory-call-form-layout.component.html',
  styleUrls: ['./advisory-call-form-layout.component.scss']
})
export class AdvisoryCallFormLayoutComponent implements OnInit, OnDestroy {

  title: string;
  isCreation: boolean;
  opportunity$: Observable<OpportunityModel>;
  loading$: Observable<boolean>;
  groupPk: number;
  private subscription = new Subscription();

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private translate: TranslateService,
    private advisoryCallService: AdvisoryCallService,
    private urlService: UrlService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap((params: ParamMap) => {
        const isCreation = !params.get('pk');
        this.loadAdvisoryCallSettings(isCreation);
        params.get('pk') ? this.manageEdition(params.get('pk')) : this.manageCreation();
      })
    ).subscribe();
  }

  loadAdvisoryCallSettings(isCreation: boolean) {
    this.subscription.add(
      this.advisoryCallService.getAdvisoryCallSettings(this.route.snapshot.data.teamSelected.groupUuid).subscribe(
        data => {
          this.groupPk = data.pk;
          // Avoid create new if you don't have available
          if (isCreation && data.total - data.consumed === 0) {
            this.navigateToAdvisoryCallList();
          }
        }
      )
    );
  }

  navigateToAdvisoryCallList () {
    const baseUrl = this.router.url.match(Urls.BASE_GENERIC_PROJECT) ?
      Urls.BASE_GENERIC_PROJECT :
      Urls.BASE_SERVICE;
    const baseAdvisoryCall = Urls.BASE_ADVISOR_REQUEST;
    const urlToNavigate = `${baseUrl}${baseAdvisoryCall}`;
    const projectPk = this.route.snapshot.data.project.pk;
    const teamPk = this.route.snapshot.data.teamSelected.pk;
    const url = this.urlService.getPath([urlToNavigate, projectPk, teamPk]);
    this.router.navigate([url]);
  }

  manageCreation(): void {
    this.isCreation = true;
    this.title = this.translate.instant('PROJECT.ADVISORY_CALL.ADVISOR_REQUEST');
  }

  manageEdition(pkOpportunity: string): void {
    this.isCreation = false;
    this.store.dispatch(new opportunitiesAdminActions.LoadOpportunityAdmin(pkOpportunity));
    this.opportunity$ = this.store.pipe(
      select((state) => fromOpportunities.selectOpportunityAdmin(
        state.opportunities.opportunitiesAdmin, pkOpportunity)),
      filter(opportunity => opportunity !== undefined),
      tap((opportunity) => {
        this.title = `${opportunity.exoRole ? opportunity.exoRole.name : '' }
          ${this.translate.instant('PROJECT.ADVISORY_CALL.REQUEST')}`;
      })
    );
    this.loading$ = this.store.pipe(select((state) =>
      fromOpportunities.selectIsLoading(state.opportunities)));
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
