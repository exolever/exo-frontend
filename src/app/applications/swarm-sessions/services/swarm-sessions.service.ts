import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Answer } from '@forum/interfaces/answer.interface';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ApiResources as ApiUrls, UrlService } from '@app/core';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { WsSubscriptionsName } from '@applications/sockets/config/config';


export enum QuestionSortEnum {
  NUM_COMMENTS_ASC = 'num-comments-asc',
  NUM_COMMENTS_DESC = 'num-comments-desc',
  ACTIVITY_ASC = 'activity-asc',
  ACTIVITY_DESC = 'activity-desc'
}

@Injectable()
export class SwarmSessionsService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  getSession(pkSession: number): Observable<SwarmSession> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.SWARM_ECOSYSTEM_SESSION, pkSession);

    return this.http
      .get<SwarmSession>(apiUrl)
      .pipe(
        map(session => new SwarmSession(session))
      );
  }

  getQuestions(params: {
    pageIndex: number;
    pageSize: number;
    pkSession: number;
    searchBy?: string;
    sortBy?: string;
  }): Observable<Pagination<Post>> {
    let apiUrl = this.urlService.resolveAPI(ApiUrls.SWARM_ECOSYSTEM_SESSION_QUESTIONS, params.pkSession);
    const paramKeys = ['page', 'page_size'];
    const paramValues = [`${params.pageIndex}`, `${params.pageSize}`];

    if (params.searchBy) {
      paramKeys.push('search');
      paramValues.push(`${params.searchBy}`);
    }

    if (params.sortBy) {
      paramKeys.push('ordering');
      let ordering = '';
      switch (params.sortBy) {
        case QuestionSortEnum.NUM_COMMENTS_ASC:
          ordering = 'comments';
          break;
        case QuestionSortEnum.NUM_COMMENTS_DESC:
          ordering = '-comments';
          break;
        case QuestionSortEnum.ACTIVITY_ASC:
          ordering = 'modified';
          break;
        case QuestionSortEnum.ACTIVITY_DESC:
          ordering = '-modified';
          break;
        default:
          ordering = 'comments';
          break;
      }
      paramValues.push(`${ordering}`);
    }

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
    pkSession: number;
    pkQuestion: number;
  }): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(
      ApiUrls.SWARM_ECOSYSTEM_SESSION_QUESTION,
      params.pkSession,
      params.pkQuestion
    );
    return this.http.get<Post>(apiUrl).pipe(map(response => new Post(response)));
  }

  getAnswers(params: {
    pageIndex: number;
    pageSize: number;
    pkSession: number;
    pkQuestion: number;
  }): Observable<Pagination<Answer>> {
    let apiUrl = this.urlService.resolveAPI(
      ApiUrls.SWARM_ECOSYSTEM_SESSION_ANSWERS,
      params.pkSession,
      params.pkQuestion
    );
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
    pkSession: number;
    pkQuestion: number;
    data: any;
  }): Observable<Answer> {

    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_CREATE, params.pkQuestion);
    return this.http.post<Answer>(apiUrl, params.data).pipe(map(response => new Answer(response)));
  }

  editAnswer(params: {
    pkSession: number;
    pkQuestion: number;
    pkAnswer: number;
    data: any;
  }): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_DETAILS, params.pkAnswer);
    return this.http.put<Answer>(apiUrl, params.data).pipe(map(response => new Answer(response)));
  }

  deleteAnswer(params: {
    pkSession: number;
    pkQuestion: number;
    pkAnswer: number;
  }): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_DETAILS, params.pkAnswer);
    return this.http.delete<Answer>(apiUrl);
  }

  getConnectedUsers(): Observable<string[]> {
    const apiUrl = this.urlService.resolveExOAuth(ApiUrls.CONNECTED_USERS, WsSubscriptionsName.SWARM);
    return this.http.get<string[]>(apiUrl).pipe(map((users: Array<any>) => users.map(user => user.userUuid)));
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
