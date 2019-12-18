import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { UserModel, ApiResources as ApiUrls, UrlService } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';
import { Answer } from '@forum/interfaces/answer.interface';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';

import * as fromState from '../../store/reducer/index';
import * as AskActions from '../../store/action/questions.action';
import * as AnswersActions from '../../store/action/answers.action';
import { SwarmWebsocketService } from '../../services/swarm-websocket.service';

@Component({
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  private pkTeam;
  private pkQuestion;
  private pkService;
  private pkSession;
  question$: Observable<Post>;
  answers$: Observable<Answer[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalAnswers$: Observable<number>;
  showRefresh$: Observable<boolean>;
  session$: Observable<SwarmSession>;
  mentionsAPI: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private location: Location,
    private store: Store<AppState>,
    private swarmSessionSocketService: SwarmWebsocketService
  ) { }

  ngOnInit() {
    this.initializeData();
    // Connect ws
    this.swarmSessionSocketService.getMessages();
  }

  initializeData() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkQuestion = +params.get('pk');
      this.pkService = +params.get('pkService');
      this.pkTeam = +params.get('pkTeam');
      this.pkSession = +params.get('pkSession');
      this.store.dispatch(new AskActions.SelectQuestion({
        pkTeam: this.pkTeam,
        pkProject: this.pkService,
        pkSession: this.pkSession,
        pkQuestion: this.pkQuestion
      }));

      this.mentionsAPI = this.urlService.resolveAPI(
        ApiUrls.SWARM_SERVICE_MENTIONS_QUESTION, this.pkService, this.pkTeam, this.pkSession, this.pkQuestion
      );
    });

    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.question$ = combineLatest(
      this.store.pipe(select(state => fromState.selectQuestionSelected(state.swarmSessions.questions))),
      this.store.pipe(select(state => fromState.selectConnectedUsers(state.swarmSessions)))
    ).pipe(
      filter(([post, users]: [Post, Array<string>]) => post !== undefined),
      map(([post, users]: [Post, Array<string>]) => {
        post.createdBy.onLine = users.includes(post.createdBy.uuid);
        return post;
      })
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

    this.showRefresh$ = this.store.pipe(select(state => fromState.selectAnswerNotification(state.swarmSessions)));
    this.session$ = this.store.pipe(select(state => fromState.selectSessionSelected(state.swarmSessions.sessions)));
    this.emptyMoment$ = this.store.pipe(select(state => fromState.answersEmptyMoment(state.swarmSessions)));
    this.loading$ = this.store.pipe(select(state => fromState.answersAreLoading(state.swarmSessions) ));
    this.pageIndex$ = this.store.pipe(select(state => fromState.selectPageIndexAnswers(state.swarmSessions)));
    this.pageSize$ = this.store.pipe(select(state => fromState.selectPageSizeAnswers(state.swarmSessions)));
    this.totalAnswers$ = this.store.pipe(select(state => fromState.selectCountAnswers(state.swarmSessions)));

  }

  onEdit(pkQuestion) {
    this.router.navigate(['edit'], { relativeTo: this.route, queryParams: {fromDetails: true} });
  }

  enableAnswerEdition(data: Answer) {
    this.store.dispatch(new AnswersActions.UpdateAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      data: data
    }));
  }

  onDeleteAnswer(pkAnswer) {
    this.store.dispatch(new AnswersActions.DeleteAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      pkAnswer: pkAnswer
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

  onDeleteQuestion(pkQuestion) {
    this.store.dispatch(new AskActions.DeleteQuestion({
      pkQuestion: pkQuestion,
      pkProject: this.pkService,
      pkSession: this.pkSession,
      pkTeam: this.pkTeam
    }));
    this.location.back();
  }

  onNewAnswer(data) {
    this.store.dispatch(new AnswersActions.CreateAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      data: data
    }));
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new AnswersActions.LoadAnswers({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkSession: this.pkSession,
      pkQuestion: this.pkQuestion,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  onRating(pkAnswer, rating): void {
    this.store.dispatch(new AnswersActions.RateAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkQuestion: this.pkQuestion,
      pkSession: this.pkSession,
      pkAnswer: pkAnswer,
      rating: rating
    }));
  }

  goBack($event) {
    this.location.back();
  }

  ngOnDestroy() {
    this.swarmSessionSocketService.closeWsChannels();
  }
}
