import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

import { Observable, combineLatest, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { UserModel, ApiResources as ApiUrls, UrlService, Urls } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';
import { Answer } from '@forum/interfaces/answer.interface';
import { Circle } from '@applications/circles/models/circle.model';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

import * as fromState from '../../store/reducer/index';
import * as AskActions from '../../store/action/questions.action';
import * as AnswersActions from '../../store/action/answers.action';
import * as CircleActions from '../../store/action/circles.action';

@Component({
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  private circleSlug: string;
  private questionSlug: string;
  private questionPk: number;
  question$: Observable<Post>;
  answers$: Observable<Answer[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalAnswers$: Observable<number>;
  showRefresh$: Observable<boolean>;
  circle$: Observable<Circle>;
  mentionsAPI: string;
  subscription: Subscription = new Subscription();
  readOnly: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private location: Location,
    private store: Store<AppState>,
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.circleSlug = params.get('circleSlug');
      this.questionSlug = params.get('questionSlug');
      this.store.dispatch(new CircleActions.LoadCircles());
      this.store.dispatch(new CircleActions.SelectCircle(this.circleSlug));
      this.store.dispatch(new AskActions.SelectQuestion({
        circleSlug: this.circleSlug,
        questionSlug: this.questionSlug
      }));

      this.mentionsAPI = this.urlService.resolveAPI(ApiUrls.CIRCLE_FOLLOWERS, this.circleSlug);
    });

    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.question$ = this.store.pipe(
      select(state => fromState.selectQuestionSelected(state.circles.questions)),
      filter(question => question !== undefined),
      tap((question: Post) => this.questionPk = question.pk)
    );
    this.answers$ = this.store.pipe(select(state => fromState.selectAllAnswers(state.circles)));

    this.circle$ = this.store.pipe(
      select(state => fromState.selectCircleSelected(state.circles.circles)),
      filter(circle => circle !== undefined),
      tap(circle => this.readOnly = circle.isGuest())
    );
    this.emptyMoment$ = this.store.pipe(select(state => fromState.answersEmptyMoment(state.circles)));
    this.loading$ = this.store.pipe(select(state => fromState.answersAreLoading(state.circles)));
    this.pageIndex$ = this.store.pipe(select(state => fromState.selectPageIndexAnswers(state.circles)));
    this.pageSize$ = this.store.pipe(select(state => fromState.selectPageSizeAnswers(state.circles)));
    this.totalAnswers$ = this.store.pipe(select(state => fromState.selectCountAnswers(state.circles)));
    this.setBreadCrumbDetail();
  }

  onEdit(pkQuestion) {
    this.router.navigate(['edit'], { relativeTo: this.route, queryParams: {fromDetails: true} });
  }

  enableAnswerEdition(data: Answer) {
    this.store.dispatch(new AnswersActions.UpdateAnswer({
      pkAnswer: data.pk,
      data: data
    }));
  }

  onDeleteAnswer(pkAnswer) {
    this.store.dispatch(new AnswersActions.DeleteAnswer(pkAnswer));
  }

  onDeleteQuestion(pkQuestion) {
    this.store.dispatch(new AskActions.DeleteQuestion(pkQuestion));
    this.location.back();
  }

  onNewAnswer(data) {
    this.store.dispatch(new AnswersActions.CreateAnswer({
      data: data,
      questionSlug: this.questionSlug
    }));
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new AnswersActions.LoadAnswers({
      pkQuestion: this.questionPk,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  onRating(pkAnswer, rating): void {
    if (!this.readOnly) {
      this.store.dispatch(new AnswersActions.RateAnswer({
        pkAnswer: pkAnswer,
        rating: rating
      }));
    }
  }

  onFavoriteAnswer(pkAnswer, isFavorite) {
    const action = isFavorite ?
      new AnswersActions.SetAsFavorite(pkAnswer) :
      new AnswersActions.UnsetAsFavorite(pkAnswer);
    if (!this.readOnly) {
      this.store.dispatch(action);
    }
  }

  onFavoriteQuestion(pkQuestion, isFavorite) {
    const action = isFavorite ?
      new AskActions.SetAsFavorite(pkQuestion) :
      new AskActions.UnsetAsFavorite(pkQuestion);

    if (!this.readOnly) {
      this.store.dispatch(action);
    }
  }

  goBack($event) {
    this.location.back();
  }

  setBreadCrumbDetail() {
    this.subscription.add(
      combineLatest(
        this.store.pipe(select(state => fromState.selectQuestionSelected(state.circles.questions))),
        this.store.pipe(select(state => fromState.selectCircleSelected(state.circles.circles)))
      ).pipe(
        filter(([question, circle]: [Post, Circle]) => question !== undefined && circle !== undefined)
      ).subscribe(([question, circle]: [Post, Circle]) => {
        this.breadCrumbService.updateBreadCrumb({
          label: circle.name,
          url: this.urlService.getPath([Urls.ECOSYSTEM_CIRCLE_DETAIL, this.circleSlug])
        });
        this.breadCrumbService.updateBreadCrumb({label: question.title});
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
