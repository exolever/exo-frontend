import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Answer } from '@forum/interfaces/answer.interface';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ApiResources as ApiUrls, UrlService } from '@app/core';


@Injectable()
export class AskToEcosystemService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  getQuestions(params: {
    pageIndex: number;
    pageSize: number;
    pkTeam: number;
    pkProject: number;
    searchBy: string;
  }): Observable<Pagination<Post>> {
    let apiUrl = this.urlService.resolveAPI(
      ApiUrls.A2E_QUESTION_LIST,
      params.pkProject,
      params.pkTeam
    );

    const paramKeys = ['page', 'page_size', 'search'];
    const paramValues = [`${params.pageIndex}`, `${params.pageSize}`, `${params.searchBy}`];

    apiUrl = this.urlService.resolveGetParams(
      apiUrl,
      paramKeys,
      paramValues
    );

    return this.http
      .get<Pagination<Post>>(apiUrl)
      .pipe(
        tap(
          (response: Pagination<Post>) =>
            (response.results = response.results.map(question => new Post(question)))
        )
      );
  }

  getQuestionDetails(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
  }): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.FORUM_QUESTION_EDIT,
      params.pkQuestion
    );
    return this.http.get<Post>(apiUrl).pipe(map(response => new Post(response)));
  }

  createQuestion(params: {
    pkTeam: number;
    pkProject: number;
    data: any;
  }): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.A2E_QUESTION_LIST,
      params.pkProject,
      params.pkTeam
    );
    return this.http.post<Post>(apiUrl, params.data).pipe(map(response => new Post(response)));
  }

  editQuestion(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
    data: any;
  }): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.FORUM_QUESTION_EDIT,
      params.pkQuestion
    );
    params.data['_type'] = 'P';
    params.data['team'] = params.pkTeam;
    return this.http.put<Post>(apiUrl, params.data).pipe(map(response => new Post(response)));
  }

  deleteQuestion(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
  }): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.FORUM_QUESTION_EDIT,
      params.pkQuestion
    );
    return this.http.delete<Post>(apiUrl);
  }

  getAnswers(params: {
    pageIndex: number;
    pageSize: number;
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
  }): Observable<Pagination<Answer>> {
    let apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_LIST, params.pkQuestion);
    apiUrl = this.urlService.resolveGetParams(
      apiUrl,
      ['page', 'page_size'],
      [`${params.pageIndex}`, `${params.pageSize}`]
    );

    return this.http
      .get<Pagination<Answer>>(apiUrl)
      .pipe(
        tap(
          (response: Pagination<Answer>) =>
            (response.results = response.results.map(
              answer => new Answer(answer)
            ))
        )
      );
  }

  createAnswer(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
    data: any;
  }): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_CREATE, params.pkQuestion);
    return this.http.post<Answer>(apiUrl, params.data).pipe(map(response => new Answer(response)));
  }

  editAnswer(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
    pkAnswer: number;
    data: any;
  }): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.FORUM_ANSWER_DETAILS,
      params.pkAnswer
    );
    params.data['answer'] = params.pkAnswer;
    return this.http.put<Answer>(apiUrl, params.data).pipe(map(response => new Answer(response)));
  }

  deleteAnswer(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
    pkAnswer: number;
  }): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.FORUM_ANSWER_DETAILS,
      params.pkAnswer
    );
    return this.http.delete<Answer>(apiUrl);
  }

  rateAnswer(params: {
    pkTeam: number;
    pkProject: number;
    pkQuestion: number;
    pkAnswer: number;
    rate: number;
  }): Observable<Answer> {

    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_RATE, params.pkAnswer);
    const data = { comment: '', rating: params.rate };
    return this.http.put<Answer>(apiUrl, data).pipe(map(response => new Answer(response)));
  }

  setFavoriteAnswer(pkAnswer, isFavorite): Observable<Answer> {
    const apiUrl = isFavorite ? ApiUrls.FORUM_ANSWER_LIKE : ApiUrls.FORUM_ANSWER_UNLIKE;
    return this.http.put<Answer>(this.urlService.resolveAPI(apiUrl, pkAnswer), {}).pipe(
      tap(response => new Answer(response))
    );
  }

  setFavoriteQuestion(pkQuestion, isFavorite): Observable<Post> {
    const apiUrl = isFavorite ? ApiUrls.FORUM_QUESTION_LIKE : ApiUrls.FORUM_QUESTION_UNLIKE;
    return this.http.put<Post>(this.urlService.resolveAPI(apiUrl, pkQuestion), {}).pipe(
      tap(response => new Post(response))
    );
  }
}
