import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, filter, first, map } from 'rxjs/operators';

import { UrlService } from '@core/services/api/resolve';
import { ApiResources } from '@app/core';
import { Survey, SurveyResultsInterface } from '../store/exq.model';
import { PromptDataInterface } from '@shared/modules/prompt-dialog/prompt-dialog.interface';
import { TranslateService } from '@ngx-translate/core';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { PaginationModel, SearchModel } from '@applications/shared/models';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import * as fromReducer from '../store/exq.reducer';


@Injectable()
export class ExqService {
  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private translate: TranslateService,
    private promptDialogService: PromptDialogService,
    private store: Store<AppState>
  ) {
  }

  getSurveys() {
    const search: SearchModel = this.setParamsForRequest();
    const baseUrl = this.urlService.resolveExQ(ApiResources.EXQ_LIST);
    const [params, values] = search.getParams();
    const url = this.urlService.resolveGetParams(baseUrl, params, values);
    return this.httpClient.get<any>(url).pipe(
      map(resp => new PaginationModel<Survey>(
        resp.count,
        resp.next,
        resp.previous,
        resp.results)
      ),
      catchError(error => of(error))
    );
  }

  getSurvey(pk: number) {
    const apiUrl = this.urlService.resolveExQ(ApiResources.EXQ_DETAIL, pk.toString());
    return this.httpClient.get<Survey>(apiUrl).pipe(
      map(response => {
        response['pk'] = response.pk;
        return new Survey(response);
      }));
  }

  addSurvey(data): Observable<Survey> {
    const apiUrl = this.urlService.resolveExQ(ApiResources.EXQ_LIST);
    return this.httpClient.post(apiUrl, data).pipe(
      map((response: any) => new Survey(response))
    );
  }

  deleteSurvey(pk: number) {
    const apiUrl = this.urlService.resolveExQ(ApiResources.EXQ_DETAIL, pk.toString());
    return this.httpClient.delete(apiUrl);
  }

  deleteResult(pkSurvey: number, pkResult: number) {
    const baseUrl =
      this.urlService.resolveExQ(ApiResources.EXQ_DELETE_RESULTS, pkResult.toString());
    const url = this.urlService.resolveGetParams(baseUrl, ['survey'], [pkSurvey]);
    return this.httpClient.delete(url);
  }

  updateSurvey(pk: number, data: any) {
    const apiUrl = this.urlService.resolveExQ(ApiResources.EXQ_DETAIL, pk.toString());
    return this.httpClient.put(apiUrl, data).pipe(
      map((response: any) => new Survey(response))
    );
  }

  getSurveysResults(pk: number): Observable<SurveyResultsInterface[]> {
    const search: SearchModel = this.setParamsForRequest('results');
    const baseUrl = this.urlService.resolveExQ(ApiResources.EXQ_RESULTS);
    const [params, values] = search.getParams();
    params.push('survey');
    values.push(pk.toString());
    const url = this.urlService.resolveGetParams(baseUrl, params, values);
    return this.httpClient.get<Survey[]>(url).pipe(
      map(response => this.parseResults(response)));
  }

  private parseResults(data): any {
    return data.results.map(res => ({
      answers: res.answers.map(r => ({section: r.section, name: r.name, value: r.value})),
      email: res.email,
      industryName: res.industryName,
      name: res.name,
      organization: res.organization,
      pk: res.pk,
      results: res.results ? res.results.map(r => ({section: r.section, score: r.score, maxScore: r.maxScore})) : [],
      total: res.total
    }));
  }

  onDelete(): Observable<any> {
    const config: PromptDataInterface = {
      title: this.translate.instant('ECOSYSTEM.EXQ.DIALOGS.DELETE.TITLE'),
      messages: [
        this.translate.instant('ECOSYSTEM.EXQ.DIALOGS.DELETE.MESSAGE_1'),
      ],
      primaryButton: this.translate.instant('ECOSYSTEM.EXQ.ACTIONS.DELETE_SURVEY'),
      secondaryButton: this.translate.instant('COMMON.CANCEL')
    };
    return this.promptDialogService.open(config).pipe(
      filter(res => res !== false && res !== undefined),
      map(res => res === true ? '' : res)
    );
  }

  private setParamsForRequest(target = 'survey'): SearchModel {
    let fn;
    if (target === 'survey') {
      fn = fromReducer.getQueryParams;
    } else {
      fn = fromReducer.getQueryParamsResult;
    }
    let search: SearchModel;
    this.store.pipe(
      first(),
      select(state => fn(<AppState>state)),
    ).subscribe(state => {
      search = new SearchModel(
        state.page,
        state.pageSize,
        state.searchTerms
      );
    });
    return search;
  }

  onDeleteResults(): Observable<any> {
    const config: PromptDataInterface = {
      title: this.translate.instant('ECOSYSTEM.EXQ.DIALOGS.DELETE_RESULT.TITLE'),
      messages: [
        this.translate.instant('ECOSYSTEM.EXQ.DIALOGS.DELETE_RESULT.MESSAGE_1'),
      ],
      primaryButton: this.translate.instant('ECOSYSTEM.EXQ.ACTIONS.DELETE_RESULT.BUTTON'),
      secondaryButton: this.translate.instant('COMMON.CANCEL')
    };
    return this.promptDialogService.open(config).pipe(
      filter(res => res !== false && res !== undefined),
      map(res => res === true ? '' : res)
    );
  }
}
