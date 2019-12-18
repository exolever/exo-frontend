import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { tap, filter } from 'rxjs/operators';

import { UserService, UserModel, ApiResources as ApiUrls, UrlService } from '@app/core';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';
import { Answer } from '@forum/interfaces/answer.interface';

import * as fromState from '../../store/reducer/index';
import * as AskActions from '../../store/action/questions.action';
import * as AnswersActions from '../../store/action/answers.action';
import { SwarmSession } from '../../sharedModule/models/session.model';
import { SwarmBreadcrumbManagerService } from '../../services/swarm-breadcrumb-manager.service';
import { SwarmWebsocketService } from '../../services/swarm-websocket.service';

@Component({
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  private pkQuestion;
  private pkSession;
  question$: Observable<Post>;
  answers$: Observable<Answer[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalAnswers$: Observable<number>;
  selectedSession$: Observable<SwarmSession>;
  showRefresh$: Observable<boolean>;
  mentionsAPI: string;

  constructor(
    private route: ActivatedRoute,
    private urlService: UrlService,
    private userService: UserService,
    private location: Location,
    private swarmBCManager: SwarmBreadcrumbManagerService,
    private store: Store<AppState>,
    private swarmSessionSocketService: SwarmWebsocketService
  ) { }

  ngOnInit() {
    this.initializeData();
    this.swarmSessionSocketService.getMessages(); // For ws
  }

  initializeData() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkQuestion = +params.get('pkQuestion');
      this.pkSession = +params.get('pkSession');
      this.store.dispatch(new AskActions.SelectQuestion({
        pkSession: this.pkSession,
        pkQuestion: this.pkQuestion
      }));
      this.mentionsAPI = this.urlService.resolveAPI(
        ApiUrls.SWARM_ECOSYSTEM_MENTIONS_QUESTION, this.pkSession, this.pkQuestion
      );
    });

    this.user$ = combineLatest(
      this.userService.user$,
      this.store.pipe(select(state => fromState.selectConnectedUsers(state.swarmSessions)))
    ).pipe(
      filter(([user, ]: [UserModel, Array<string>]) => user !== undefined),
      map(([user, connectedUsers]: [UserModel, Array<string>]) => {
        user.onLine = connectedUsers.includes(user.uuid);
        return user;
      })
    );
    this.question$ = this.store.pipe(
      select(state => fromState.selectQuestionSelected(state.swarmSessions.questions)),
      filter((question: Post) => question !== undefined),
      tap((question: Post) =>
        this.swarmBCManager.setBreadcrumbEcosystemQuestionDetailView(question.title, this.pkSession))
      );
    this.answers$ = combineLatest(
      this.store.pipe(select(state => fromState.selectAllAnswers(state.swarmSessions))),
      this.store.pipe(select(state => fromState.selectConnectedUsers(state.swarmSessions)))
    ).pipe(
      map(([answers, users]: [Array<Answer>, Array<string>]) =>
        answers.map(answer => {
          answer.createdBy.onLine = users.includes(answer.createdBy.uuid);
          return answer;
        })
      )
    );


    this.emptyMoment$ = this.store.pipe(select(state => fromState.answersEmptyMoment(state.swarmSessions)));
    this.loading$ = this.store.pipe(select(state => fromState.answersAreLoading(state.swarmSessions) ));
    this.pageIndex$ = this.store.pipe(select(state => fromState.selectPageIndexAnswers(state.swarmSessions)));
    this.pageSize$ = this.store.pipe(select(state => fromState.selectPageSizeAnswers(state.swarmSessions)));
    this.totalAnswers$ = this.store.pipe(select(state => fromState.selectCountAnswers(state.swarmSessions)));
    this.showRefresh$ = this.store.pipe(select(state => fromState.selectAnswerNotification(state.swarmSessions)));
    this.selectedSession$ = combineLatest(
      this.store.pipe(select(state => fromState.selectSessionSelected(state.swarmSessions))),
      this.store.pipe(select(state => fromState.selectConnectedUsers(state.swarmSessions)))
    ).pipe(
      filter(([session, users]: [SwarmSession, Array<string>]) => session !== undefined),
      map(([session, users]: [SwarmSession, Array<string>]) => {
        session.advisors = session.advisors.map(advisor => {
          advisor.onLine = users.includes(advisor.uuid);
          return advisor;
        });
        return session;
      })
    );
  }

  enableAnswerEdition(data: Answer) {
    this.store.dispatch(new AnswersActions.UpdateAnswer({
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      data: data
    }));
  }

  onDeleteAnswer(pkAnswer: number) {
    this.store.dispatch(new AnswersActions.DeleteAnswer({
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      pkAnswer: pkAnswer
    }));
  }

  onNewAnswer(data) {
    this.store.dispatch(new AnswersActions.CreateAnswer({
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      data: data
    }));
  }

  onFavoriteAnswer(pkAnswer, isFavorite) {
    const action = isFavorite ?
      new AnswersActions.SetAsFavorite(pkAnswer) :
      new AnswersActions.UnsetAsFavorite(pkAnswer);
    this.store.dispatch(action);
  }

  onFavoriteQuestion(pkQuestion, isFavorite) {
    const action = isFavorite ?
      new AskActions.SetAsFavorite(pkQuestion) :
      new AskActions.UnsetAsFavorite(pkQuestion);
    this.store.dispatch(action);
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new AnswersActions.LoadAnswers({
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  goBack($event) {
    this.location.back();
  }

  ngOnDestroy() {
    this.swarmSessionSocketService.closeWsChannels();
  }
}
