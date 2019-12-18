import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';

import { Urls, UrlService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

import * as opportunitiesAdminActions from '../../modules/admin/store/actions/opportunities-admin.action';
import * as fromOpportunities from '../../store/reducers';
import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunityFormComponent } from '../opportunity-form/opportunity-form.component';

@Component({
  selector: 'app-opportunity-form-layout',
  templateUrl: './opportunity-form-layout.component.html',
  styleUrls: ['./opportunity-form-layout.component.scss']
})
export class OpportunityFormLayoutComponent implements OnInit {
  @ViewChild('formComponent', {static: false}) formComponent: OpportunityFormComponent;
  opportunity$: Observable<OpportunityModel>;
  isCreation: boolean;
  loading$: Observable<boolean>;
  title: string;

  constructor(
    private translateService: TranslateService,
    private breadCrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private urlService: UrlService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap((params: ParamMap) => {
        params.get('pk') ? this.manageEdition(params.get('pk')) : this.manageCreation();
      })
    ).subscribe();
  }

  manageCreation(): void {
    this.isCreation = true;
    this.breadCrumbService.updateBreadCrumb({
      label: this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.CREATE.BREADCRUMB')
    });
    this.title = this.translate.instant('ECOSYSTEM.OPPORTUNITIES.OPPORTUNITIES');
  }

  manageEdition(pkOpportunity: string): void {
    this.isCreation = false;
    this.store.dispatch(new opportunitiesAdminActions.LoadOpportunityAdmin(pkOpportunity));
    this.opportunity$ = this.store.pipe(
      select((state) => fromOpportunities.selectOpportunityAdmin(
        state.opportunities.opportunitiesAdmin, pkOpportunity)),
      filter(opportunity => opportunity !== undefined),
      tap((opportunity) => {
        const detailUrl = this.urlService.getPath([Urls.ECOSYSTEM_OPPORTUNITY_ADMIN, pkOpportunity]);
        this.breadCrumbService.updateBreadCrumb({
          label: opportunity.subject,
          url: detailUrl
        });
        this.breadCrumbService.appendCrumb(
          this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.BREADCRUMB')
        );
        this.title = `${opportunity.exoRole ? opportunity.exoRole.name : '' }
          ${this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.OPPORTUNITY')}`;
      })
    );
    this.loading$ = this.store.pipe(select((state) =>
      fromOpportunities.selectIsLoading(state.opportunities)));
  }

}


