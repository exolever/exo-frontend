import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';

import * as MomentTz from 'moment-timezone';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { UserModel } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';

import * as QuestionActions from '../../store/action/questions.action';
import * as AnswerActions from '../../store/action/answers.action';
import * as fromStore from '../../store/reducer/index';
import { SwarmBreadcrumbManagerService } from './../../services/swarm-breadcrumb-manager.service';
import { SwarmWebsocketService } from '../../services/swarm-websocket.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionSortEnum } from '@applications/swarm-sessions/services/swarm-sessions.service';

@Component({
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  pkSession;
  searchBox = new FormControl();
  subscriptions: Subscription[] = [];
  questions$: Observable<Post[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  sortValue$: Observable<string>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalQuestion$: Observable<number>;
  text$: Observable<string>;
  showRefresh$: Observable<boolean>;
  selectedSession$: Observable<SwarmSession>;

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
    private swarmBCManager: SwarmBreadcrumbManagerService,
    private store: Store<AppState>,
    private swarmSessionSocketService: SwarmWebsocketService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.initializeData();
    this.swarmSessionSocketService.getMessages(); // For ws
  }

  initializeData () {
    this.store.dispatch(new QuestionActions.RestoreState());
    this.store.dispatch(new AnswerActions.RestoreState());
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkSession = +params.get('pkSession');
      this.store.dispatch(new QuestionActions.LoadSession(this.pkSession));
      this.store.dispatch(new AnswerActions.SetSession(this.pkSession));
      this.swarmBCManager.setBreadcrumbEcosystemMainView(this.pkSession);
    });

    this.subscriptions.push(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) => this.store.dispatch(new QuestionActions.SetSearch({
          pkSession: this.pkSession,
          searchBy: value,
          sort: this.sort ? this.sort : QuestionSortEnum.NUM_COMMENTS_ASC,
        }))
      )
    );

    this.sortValue$ = this.store.pipe(select(state => fromStore.selectSortBy(state.swarmSessions)));
    this.emptyMoment$ = this.store.pipe(select(state => fromStore.questionsEmptyMoment(state.swarmSessions)));
    this.loading$ = this.store.pipe(select(state => fromStore.questionsAreLoading(state.swarmSessions)));
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.questions$ = combineLatest([
      this.store.pipe(select(state => fromStore.selectAllQuestions(state.swarmSessions))),
      this.store.pipe(select(state => fromStore.selectConnectedUsers(state.swarmSessions)))
    ]).pipe(
      map(([questions, users]: [Array<Post>, Array<string>]) =>
        questions.map(post => {
          post.createdBy.onLine = users.includes(post.createdBy.uuid);
          return post;
        })
      )
    );
    this.pageIndex$ = this.store.pipe(select(state => fromStore.selectPageIndexQuestion(state.swarmSessions)));
    this.showRefresh$ = this.store.pipe(select(state => fromStore.selectQuestionNotification(state.swarmSessions)));
    this.pageSize$ = this.store.pipe(select(state => fromStore.selectPageSizeQuestion(state.swarmSessions)));
    this.totalQuestion$ = this.store.pipe(select(state => fromStore.selectCountQuestions(state.swarmSessions)));
    this.text$ = this.store.pipe(select(state => fromStore.selectSearchBy(state.swarmSessions)));
    this.selectedSession$ = combineLatest([
      this.store.pipe(select(state => fromStore.selectSessionSelected(state.swarmSessions))),
      this.store.pipe(select(state => fromStore.selectConnectedUsers(state.swarmSessions)))
    ]).pipe(
      filter(([session]: [SwarmSession, Array<string>]) => session !== undefined),
      map(([session, users]: [SwarmSession, Array<string>]) => {
        session.advisors = session.advisors.map(advisor => {
          advisor.onLine = users.includes(advisor.uuid);
          return advisor;
        });
        return session;
      })
    );
  }

  onSeeDetails(pkQuestion) {
    this.router.navigate([`${pkQuestion}`], {
      relativeTo: this.route,
      preserveQueryParams: true
    });
  }

  paginatorChange(page: PageEvent): void {
    this.page.index = page.pageIndex + 1;
    this.page.size = page.pageSize;

    this.store.dispatch(new QuestionActions.LoadQuestions({
      pkSession: this.pkSession,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize,
      sort: this.sort ? this.sort : QuestionSortEnum.NUM_COMMENTS_ASC
    }));
  }

  isSessionExpired(session: SwarmSession): boolean {
    return MomentTz().isBefore(session.endAt);
  }

  onUpdateSortBy(event) {
    this.sort = event.value;
    this.store.dispatch(new QuestionActions.SortQuestions({
      pkSession: this.pkSession,
      sort: event.value,
      page: this.page,
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.swarmSessionSocketService.closeWsChannels();
  }
}
