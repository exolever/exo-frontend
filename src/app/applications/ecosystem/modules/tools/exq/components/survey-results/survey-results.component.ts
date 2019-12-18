import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import { ApiResources, Urls, UrlService } from '@core/services';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

import * as SurveyActions from '../../store/exq.action';
import { Survey, SurveyResultsInterface } from '../../store/exq.model';
import * as fromSurvey from '../../store/exq.reducer';
import { SectionExqEnum } from '@ecosystem/modules/tools/exq/exq.enum';
import { FormControl } from '@angular/forms';
import * as fromSurveys from '@ecosystem/modules/tools/exq/store/exq.reducer';
import * as exqActions from '@ecosystem/modules/tools/exq/store/exq.action';
import { ExqService } from '@ecosystem/modules/tools/exq/service/exq.service';

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.scss']
})
export class SurveyResultsComponent implements OnInit, OnDestroy {
  survey$: Observable<Survey>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  totalResults$: Observable<number>;
  searchControl = new FormControl();
  searchedText$: Observable<string>;
  pkSurvey: string;
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private breadCrumbService: BreadCrumbService,
    private translateService: TranslateService,
    private exqService: ExqService,
  ) {
  }

  ngOnInit(): void {
    this.initializeData();
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(
          (value: string) => this.store.dispatch(
            new SurveyActions.SetSearchTermsResult({term: value, pkSurvey: +this.pkSurvey})
          )
        ));
    this.route.paramMap.pipe(
      tap((params: ParamMap) => {
        this.pkSurvey = params.get('pk');
        if ( this.pkSurvey ) {
          this.store.dispatch(new SurveyActions.LoadSurvey(+this.pkSurvey));
          this.store.dispatch(new SurveyActions.GetSurveyResults(+this.pkSurvey));
          this.survey$ = this.store.pipe(
            select((state) => fromSurvey.selectSurvey(state.surveys, +this.pkSurvey)),
            filter(survey => survey !== undefined),
            tap((survey) => {
              const detailUrl = this.urlService.getPath([Urls.ECOSYSTEM_EXQ_RESULTS, this.pkSurvey]);
              this.breadCrumbService.updateBreadCrumb({
                label: survey.name,
                url: detailUrl
              });
              this.breadCrumbService.appendCrumb(
                this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EXQ.RESULTS')
              );
            })
          );
        }
      })
    ).subscribe();
  }

  onDownloadPdf(result) {
    const newWindow = window.open('', '_blank');
    newWindow.location.href = this.urlService.resolveExQ(
      ApiResources.EXQ_DOWNLOAD_PDF, result.pk.toString()
    );
  }

  getAnswerSet(section: SectionExqEnum, answersList:
    { section: SectionExqEnum; name: string; value: string }[]): any {
    return answersList.filter(a => a.section === section);
  }

  paginatorChange($event) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.store.dispatch(new SurveyActions.PaginateResult({
      pageIndex: pageIndex + 1,
      pageSize: pageSize,
      pkSurvey: +this.pkSurvey
    }));
  }

  private initializeData() {
    this.searchedText$ = this.store.pipe(select(state => fromSurveys.getResultTerms(state)));
    this.totalResults$ = this.store.pipe(select(state => fromSurveys.getResultTotalResults(state)));
    this.pageIndex$ = this.store.pipe(select(state => fromSurveys.getResultPage(state)));
    this.pageSize$ = this.store.pipe(select(state => fromSurveys.getResultPageSize(state)));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onDelete(result: SurveyResultsInterface) {
    this.subscriptions.add(this.exqService.onDeleteResults().subscribe(res => {
      this.store.dispatch(new exqActions.DeleteResult({pkResult: result.pk, pkSurvey: +this.pkSurvey}));
    }));
  }
}
