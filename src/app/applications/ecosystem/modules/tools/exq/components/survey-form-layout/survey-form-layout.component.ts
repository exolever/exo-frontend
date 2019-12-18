import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { tap, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Urls, UrlService } from '@core/services';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { AppState } from '@core/store/reducers';
import * as fromSurvey from '../../store/exq.reducer';
import { Survey } from '../../store/exq.model';
import * as SurveyActions from '../../store/exq.action';

@Component({
  templateUrl: './survey-form-layout.component.html',
  styleUrls: ['./survey-form-layout.component.scss'],
})
export class SurveyFormLayoutComponent implements OnInit, OnDestroy {
  isDirty = false;
  pk: string;
  survey$: Observable<Survey>;
  private subscriptions = new Subscription;

  constructor(
    private translateService: TranslateService,
    private breadCrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private urlService: UrlService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap((params: ParamMap) => {
        params.get('pk') ? this.manageEdition(params.get('pk')) : this.manageCreation();
      })
    ).subscribe();
  }

  manageCreation() {
    this.breadCrumbService.updateBreadCrumb({
      label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EXQ.CREATE')
    });
  }

  manageEdition(pkSurvey: string) {
    this.store.dispatch(new SurveyActions.LoadSurvey(+pkSurvey));
    this.survey$ = this.store.pipe(
      select((state) => fromSurvey.selectSurvey(state.surveys, +pkSurvey)),
      filter(survey => survey !== undefined),
      tap((survey) => {
        const detailUrl = this.urlService.getPath([Urls.ECOSYSTEM_EXQ_RESULTS, pkSurvey]);
        this.breadCrumbService.updateBreadCrumb({
          label: survey.name,
          url: detailUrl
        });
        this.breadCrumbService.appendCrumb(
          this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EXQ.EDIT')
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
