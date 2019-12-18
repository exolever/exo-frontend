import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { UserModel } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { TeamModel } from '@service/old-project/models/team.model';
import { Team as TeamGProjectModel } from '@applications/workspace/projects/models/team.model';
import { AppState } from '@core/store/reducers';

import { Post } from '@forum/interfaces/post.interface';

import * as QuestionActions from '../../store/action/questions.action';
import * as AnswerActions from '../../store/action/answers.action';
import * as fromStore from '../../store/reducer/index';


@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  private pkProject;
  private pkTeam;
  searchBox = new FormControl();
  subscriptions: Subscription[] = [];
  questions$: Observable<Post[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalQuestion$: Observable<number>;
  text$: Observable<string>;
  team: TeamModel | TeamGProjectModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new QuestionActions.RestoreState());
    this.store.dispatch(new AnswerActions.RestoreState());
    this.subscriptions.push(this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkProject = +params.get('pkService');
      this.pkTeam = +params.get('pkTeam');
      this.store.dispatch(new QuestionActions.LoadQuestions({
        pkTeam: this.pkTeam,
        pkProject: this.pkProject,
        pageIndex: 1,
        pageSize: 15
      }));
    }));

    this.subscriptions.push(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(
        (value: string) => this.store.dispatch(new QuestionActions.SetSearch({
          pkProject: this.pkProject,
          pkTeam: this.pkTeam,
          searchBy: value
        }))
      )
    );

    this.emptyMoment$ = this.store.pipe(select(state => fromStore.questionsEmptyMoment(state.askToEcosystem)));
    this.loading$ = this.store.pipe(select(state => fromStore.questionsAreLoading(state.askToEcosystem) ));
    this.team = this.route.snapshot.data.teamSelected;
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.questions$ = this.store.pipe(select(state => fromStore.selectAllQuestions(state.askToEcosystem)));
    this.pageIndex$ = this.store.pipe(select(state => fromStore.selectPageIndexQuestion(state.askToEcosystem)));
    this.pageSize$ = this.store.pipe(select(state => fromStore.selectPageSizeQuestion(state.askToEcosystem)));
    this.totalQuestion$ = this.store.pipe(select(state => fromStore.selectCountQuestions(state.askToEcosystem)));
    this.text$ = this.store.pipe(select(state => fromStore.selectSearchBy(state.askToEcosystem)));
  }

  onSeeDetails(pkQuestion) {
    this.router.navigate([pkQuestion], { relativeTo: this.route });
  }

  onEdit(pkQuestion) {
    this.router.navigate([`${pkQuestion}/edit`], { relativeTo: this.route });
  }

  onDelete(pkQuestion) {
    this.store.dispatch(new QuestionActions.DeleteQuestion({
      pkQuestion: pkQuestion,
      pkProject: this.pkProject,
      pkTeam: this.pkTeam
    }));
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new QuestionActions.LoadQuestions({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
