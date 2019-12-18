import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { UserModel } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

import * as QuestionActions from '../../store/action/questions.action';
import * as AnswersActions from '../../store/action/answers.action';
import * as CirclesActions from '../../store/action/circles.action';
import * as fromStore from '../../store/reducer/index';
import { Circle } from '../../models/circle.model';


@Component({
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  circleSlug: string;
  searchBox = new FormControl('');
  subscriptions = new Subscription();
  questions$: Observable<Post[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalQuestion$: Observable<number>;
  text$: Observable<string>;
  circle$: Observable<Circle>;
  circles$: Observable<Circle[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new QuestionActions.RestoreState());
      this.store.dispatch(new AnswersActions.RestoreState());
      this.circleSlug = params.get('circleSlug');
      this.store.dispatch(new CirclesActions.LoadCircles());
      this.store.dispatch(new CirclesActions.SelectCircle(this.circleSlug));
      this.store.dispatch(new QuestionActions.LoadQuestions({circleSlug: this.circleSlug}));
    });

    this.subscriptions.add(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) => this.store.dispatch(new QuestionActions.SetSearch({
          circleSlug: this.circleSlug,
          searchBy: value
        }))
      )
    );

    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.questions$ = this.store.pipe(select(state => fromStore.selectAllQuestions(state.circles)));
    this.emptyMoment$ = this.store.pipe(select(state => fromStore.questionsEmptyMoment(state.circles)));
    this.loading$ = this.store.pipe(select(state => fromStore.questionsAreLoading(state.circles)));
    this.pageIndex$ = this.store.pipe(select(state => fromStore.selectPageIndexQuestion(state.circles)));
    this.pageSize$ = this.store.pipe(select(state => fromStore.selectPageSizeQuestion(state.circles)));
    this.totalQuestion$ = this.store.pipe(select(state => fromStore.selectCountQuestions(state.circles)));
    this.text$ = this.store.pipe(select(state => fromStore.selectSearchBy(state.circles)));
    this.circle$ = this.store.pipe(
      select(state => fromStore.selectCircleSelected(state.circles.circles)),
      filter(circle => circle !== undefined),
      tap(circle => this.breadCrumbService.updateBreadCrumb({label: circle.name}))
    );
    this.circles$ = this.store.pipe(select(state => fromStore.selectAllCircles(state.circles)));
  }

  onSeeDetails(questionSlug: string) {
    // Tracking: (ActionGA.DetailsFromList, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });

    this.router.navigate([`${questionSlug}`], { relativeTo: this.route });
  }

  onEdit(questionSlug: string) {
    // Tracking: (ActionGA.EditionFromList, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });
    this.router.navigate([`${questionSlug}/edit`], { relativeTo: this.route });
  }

  onCreate(circle: Circle) {
    if (circle.isGuest()) {
      // Tracking: (ActionGA.JoinFromCircle, {
      //   label: CategoryGA.Circles,
      //   category: CategoryGA.Circles
      // });
      this.router.navigate([`join`], { relativeTo: this.route });
    } else {
      // Tracking: (ActionGA.CreateFromList, {
      //   label: CategoryGA.Circles,
      //   category: CategoryGA.Circles
      // });
      this.router.navigate([`create`], { relativeTo: this.route });
    }
  }

  onDelete(pkPost: number) {
    // Tracking: (ActionGA.DeletionFromSummary, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });
    this.store.dispatch(new QuestionActions.DeleteQuestion(pkPost));
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new QuestionActions.SetPagination({
      circleSlug: this.circleSlug,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
