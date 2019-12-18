import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ApiResources as ApiUrls, UrlService, UserModel } from '@app/core';
import { Pagination } from '@core/interfaces/pagination.interface';
import { Post } from '@applications/forum/interfaces/post.interface';
import { Answer } from '@applications/forum/interfaces/answer.interface';

import { Circle} from '../models/circle.model';
import { CircleDeserializerService } from '@applications/circles/services/circle-deserializer.service';

@Injectable()
export class CircleService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private circleDeserializerService: CircleDeserializerService
  ) { }

  getCircles(onlyPublics = false): Observable<Pagination<Circle>> {
    let apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_LIST);
    if (onlyPublics) {
      apiUrl = this.urlService.resolveGetParams(apiUrl, ['status'], ['U']);
    }
    return this.http.get<Pagination<Circle>>(apiUrl).pipe(
      tap((response: Pagination<Circle>) => response.results = response.results.map(
        obj => this.circleDeserializerService.deserialize(obj)))
    );
  }

  createPost(circleSlug, data): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_POST_CREATE, circleSlug);
    return this.http.post<Post>(apiUrl, data).pipe(map(response => new Post(response)));
  }

  editPost(pkPost: number, data): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_QUESTION_EDIT, pkPost);
    return this.http.put<Post>(apiUrl, data).pipe(map(response => new Post(response)));
  }

  deletePost(pkPost: number): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_QUESTION_EDIT, pkPost);
    return this.http.delete<Post>(apiUrl);
  }

  getPosts(params: {
    pageIndex: number;
    pageSize: number;
    circleSlug: string;
    searchBy: string;
  }): Observable<Pagination<Post>> {
    let apiUrl = this.urlService.resolveAPI(
      ApiUrls.CIRCLE_POSTS,
      params.circleSlug
    );
    const paramKeys = ['page', 'page_size', 'search'];
    const paramValues = [`${params.pageIndex}`, `${params.pageSize}`, `${params.searchBy}`];

    apiUrl = this.urlService.resolveGetParams(apiUrl, paramKeys, paramValues);
    return this.http
      .get<Pagination<Post>>(apiUrl)
      .pipe(
        tap((response: Pagination<Post>) =>
          (response.results = response.results.map(question => new Post(question)))
        )
      );
  }

  getPostDetails(postSlug: string): Observable<Post> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_POST_DETAIL, postSlug);
    return this.http.get<Post>(apiUrl).pipe(map(response => new Post(response)));
  }

  createAnswer(pkQuestion, data): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_CREATE, pkQuestion);
    return this.http.post<Answer>(apiUrl, data).pipe(map(response => new Answer(response)));
  }

  editAnswer(pkAnswer, data): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_DETAILS, pkAnswer);
    return this.http.put<Answer>(apiUrl, data).pipe(map(response => new Answer(response)));
  }

  deleteAnswer(pkAnswer): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_DETAILS, pkAnswer);
    return this.http.delete<Answer>(apiUrl);
  }

  getAnswers(params: {
    pageIndex: number;
    pageSize: number;
    pkQuestion: number;
    searchBy: string;
  }): Observable<Pagination<Answer>> {
    let apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_LIST, params.pkQuestion);
    const paramKeys = ['page', 'page_size', 'search'];
    const paramValues = [`${params.pageIndex}`, `${params.pageSize}`, `${params.searchBy}`];
    apiUrl = this.urlService.resolveGetParams(apiUrl, paramKeys, paramValues);

    return this.http.get<Pagination<Answer>>(apiUrl).pipe(
      tap((response: Pagination<Answer>) => (response.results = response.results.map(question => new Answer(question))))
    );
  }

  rateAnswer(pkAnswer: number, rate: number): Observable<Answer> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.FORUM_ANSWER_RATE, pkAnswer);
    const data = { comment: '', rating: rate };
    return this.http.put<Answer>(apiUrl, data).pipe(tap(response => new Answer(response)));
  }

  getFollowers(params: {
    pageIndex: number;
    pageSize: number;
    circleSlug: string;
    searchBy: string;
  }): Observable<Pagination<UserModel>> {
    let apiUrl = this.urlService.resolveAPI(
      ApiUrls.CIRCLE_FOLLOWERS,
      params.circleSlug
    );
    const paramKeys = ['page', 'page_size', 'search'];
    const paramValues = [`${params.pageIndex}`, `${params.pageSize}`, `${params.searchBy}`];

    apiUrl = this.urlService.resolveGetParams(apiUrl, paramKeys, paramValues);
    return this.http
      .get<Pagination<UserModel>>(apiUrl);
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

  backwardCompatibility(postSlug: string): Observable<{postSlug: string, circleSlug: string, isRemoved: boolean}> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_LEGACY_INFO, postSlug);
    return this.http.get<{postSlug: string, circleSlug: string, isRemoved: boolean}>(apiUrl);
  }

  feed(): Observable<Post[]> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_FEED);
    return this.http.get<Pagination<Post>>(apiUrl).pipe(map(response => response.results.map(obj => new Post(obj))));
  }

  createCircle(data): Observable<Circle> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_LIST);
    return this.http.post<Circle>(apiUrl, data).pipe(map(response => new Circle(response)));
  }

  updateCircle(slug: string, data): Observable<Circle> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_DETAILS, slug);
    return this.http.put<Circle>(apiUrl, data).pipe(map(response => new Circle(response)));
  }

  loadCircleDetails(slug: string): Observable<Circle> {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_DETAILS, slug);
    return this.http.get<Circle>(apiUrl).pipe(map(response => new Circle(response)));
  }

  join(slug: string) {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_JOIN, slug);
    return this.http.post<Circle>(apiUrl, {}).pipe(map(response => new Circle(response)));
  }

  leave(slug: string) {
    const apiUrl = this.urlService.resolveAPI(ApiUrls.CIRCLE_LEAVE, slug);
    return this.http.post<Circle>(apiUrl, {}).pipe(map(response => new Circle(response)));
  }
}
