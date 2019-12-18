import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';

import * as MomentTZ from 'moment-timezone';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { Urls, UrlService, UserModel } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { Post } from '@forum/interfaces/post.interface';

import * as QuestionActions from '../../store/action/questions.action';
import * as AnswersActions from '../../store/action/answers.action';
import * as SessionActions from '../../store/action/sessions.action';
import * as fromStore from '../../store/reducer/index';
import { SwarmWebsocketService } from '../../services/swarm-websocket.service';
import { QuestionSortEnum } from '@applications/swarm-sessions/services/swarm-sessions.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  pkProject;
  pkTeam;
  pkSession;
  selectSession = new FormControl();
  searchBox = new FormControl();
  subscriptions: Subscription[] = [];
  questions$: Observable<Post[]>;
  sessions$: Observable<SwarmSession[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalQuestion$: Observable<number>;
  text$: Observable<string>;
  showRefresh$: Observable<boolean>;
  selectedSession$: Observable<SwarmSession>;
  sortValue$: Observable<string>;
  page: { size: number, index: number } = { size: 50, index: 1 };
  sort: QuestionSortEnum;

  sortOptions = [
    {
      value: QuestionSortEnum.NUM_COMMENTS_ASC,
      text: this.translate.instant('SWARM.QUESTION.NUM_COMMENTS_ASC')
    },
    {
      value: QuestionSortEnum.NUM_COMMENTS_DESC,
      text: this.translate.instant('SWARM.QUESTION.NUM_COMMENTS_DESC')
    },
    {
      value: QuestionSortEnum.ACTIVITY_ASC,
      text: this.translate.instant('SWARM.QUESTION.ACTIVITY_ASC')
    },
    {
      value: QuestionSortEnum.ACTIVITY_DESC,
      text: this.translate.instant('SWARM.QUESTION.ACTIVITY_DESC')
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private store: Store<AppState>,
    private swarmSessionSocketService: SwarmWebsocketService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new QuestionActions.RestoreState());
      this.store.dispatch(new AnswersActions.RestoreState());
      this.pkProject = +params.get('pkService');
      this.pkTeam = +params.get('pkTeam');
      this.pkSession = params.get('pkSession') ? +params.get('pkSession') : undefined;

      this.store.dispatch(new SessionActions.LoadSessions({
        pkTeam: this.pkTeam,
        pkProject: this.pkProject
      }));

      if (this.pkSession) {
        this.selectSession.setValue(this.pkSession, {emitEvent: false});
        this.store.dispatch(new QuestionActions.SetSession(this.pkSession));
        this.store.dispatch(new AnswersActions.SetSession(this.pkSession));
        this.store.dispatch(new SessionActions.SelectSession({
          pkTeam: this.pkTeam,
          pkProject: this.pkProject,
          pkSession: this.pkSession
        }));
      }
    });

    this.subscriptions.push(
      this.selectSession.valueChanges.pipe(
        distinctUntilChanged()
      ).subscribe((value: string) => {
        const url = this.urlService.getPath([Urls.SWARM_SESSIONS_SERVICE, this.pkProject, this.pkTeam, value]);
        this.router.navigate([url], { relativeTo: this.route });
      })
    );

    this.subscriptions.push(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) => this.store.dispatch(new QuestionActions.SetSearch({
          pkSession: this.pkSession,
          pkProject: this.pkProject,
          pkTeam: this.pkTeam,
          searchBy: value,
          sort: this.sort ? this.sort : QuestionSortEnum.NUM_COMMENTS_ASC,
        }))
      )
    );

    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.questions$ = combineLatest(
      this.store.pipe(select(state => fromStore.selectAllQuestions(state.swarmSessions))),
      this.store.pipe(select(state => fromStore.selectConnectedUsers(state.swarmSessions)))
    ).pipe(
      map(([questions, users]: [Array<Post>, Array<string>]) =>
        questions.map(post => {
          post.createdBy.onLine = users.includes(post.createdBy.uuid);
          return post;
        })
      )
    );
    this.emptyMoment$ = this.store.pipe(select(state => fromStore.questionsEmptyMoment(state.swarmSessions)));
    this.sortValue$ = this.store.pipe(select(state => fromStore.selectSortBy(state.swarmSessions)));
    this.loading$ = this.store.pipe(select(state => fromStore.questionsAreLoading(state.swarmSessions)));
    this.pageIndex$ = this.store.pipe(select(state => fromStore.selectPageIndexQuestion(state.swarmSessions)));
    this.showRefresh$ = this.store.pipe(select(state => fromStore.selectQuestionNotification(state.swarmSessions)));
    this.pageSize$ = this.store.pipe(select(state => fromStore.selectPageSizeQuestion(state.swarmSessions)));
    this.totalQuestion$ = this.store.pipe(select(state => fromStore.selectCountQuestions(state.swarmSessions)));
    this.text$ = this.store.pipe(select(state => fromStore.selectSearchBy(state.swarmSessions)));
    this.sessions$ = this.store.pipe(select(state => fromStore.selectSessions(state.swarmSessions)));
    this.selectedSession$ = this.store.pipe(
      select(state => fromStore.selectSessionSelected(state.swarmSessions.sessions)));

    // If the user hasn't selected any session, I try to select one active when all sessions have been loaded
    this.subscriptions.push(
      this.sessions$.pipe(
        filter((sessions: SwarmSession[]) => this.pkSession === undefined && sessions.length > 0)
      ).subscribe((sessions: SwarmSession[]) => {
        const sessionActive = sessions.find(obj => MomentTZ().isBetween(obj.startAt, obj.endAt));
        this.pkSession = sessionActive ? sessionActive.pk : sessions.pop().pk;
        this.store.dispatch(new SessionActions.SelectSession({
          pkTeam: this.pkTeam,
          pkProject: this.pkProject,
          pkSession: this.pkSession
        }));
        this.store.dispatch(new QuestionActions.SetSession(this.pkSession));
        this.store.dispatch(new AnswersActions.SetSession(this.pkSession));
        this.selectSession.setValue(this.pkSession, {emitEvent: false});
      })
    );

    // Connect ws
    this.swarmSessionSocketService.getMessages();
  }

  onSeeDetails(pkQuestion) {
    this.router.navigate([`${this.pkSession}/${pkQuestion}`], { relativeTo: this.route.parent });
  }

  onEdit(pkQuestion) {
    this.router.navigate([`${this.pkSession}/${pkQuestion}/edit`], { relativeTo: this.route.parent });
  }

  onCreate() {
    this.router.navigate([`${this.pkSession}/create`], { relativeTo: this.route.parent });
  }

  onDelete(pkQuestion) {
    this.store.dispatch(new QuestionActions.DeleteQuestion({
      pkQuestion: pkQuestion,
      pkProject: this.pkProject,
      pkSession: this.pkSession,
      pkTeam: this.pkTeam
    }));
  }

  onReload() {
    this.store.dispatch(new QuestionActions.LoadQuestions({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      pkSession: this.pkSession,
      pageIndex: 1,
      pageSize: 50
    }));
  }

  paginatorChange(page: PageEvent): void {
    this.page.index = page.pageIndex + 1;
    this.page.size = page.pageSize;

    this.store.dispatch(new QuestionActions.LoadQuestions({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      pkSession: this.pkSession,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize,
      sortBy: this.sort ? this.sort : QuestionSortEnum.NUM_COMMENTS_ASC,
    }));
  }

  onUpdateSortBy(event) {
    this.sort = event.value;

    this.store.dispatch(new QuestionActions.SortQuestions({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      pkSession: this.pkSession,
      sort: event.value,
      page: this.page
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.swarmSessionSocketService.closeWsChannels();
  }
}
