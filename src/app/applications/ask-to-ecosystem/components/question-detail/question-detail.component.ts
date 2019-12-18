import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { UserModel } from '@app/core';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';
import { Answer } from '@forum/interfaces/answer.interface';

import * as fromState from '../../store/reducer/index';
import * as AskActions from '../../store/action/questions.action';
import * as AnswersActions from '../../store/action/answers.action';


@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  private pkTeam;
  private pkQuestion;
  private pkService;
  question$: Observable<Post>;
  answers$: Observable<Answer[]>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  loading$: Observable<boolean>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalAnswers$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkQuestion = +params.get('pk');
      this.pkService = +params.get('pkService');
      this.pkTeam = +params.get('pkTeam');
      this.store.dispatch(new AskActions.SelectQuestion({
        pkTeam: this.pkTeam,
        pkProject: this.pkService,
        pkQuestion: this.pkQuestion
      }));
    });

    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.question$ = this.store.pipe(
      select(state => fromState.selectQuestionSelected(state.askToEcosystem.questions)));
    this.answers$ = this.store.pipe(
      select(state => fromState.selectAllAnswers(state.askToEcosystem)));

    this.emptyMoment$ = this.store.pipe(select(state => fromState.answersEmptyMoment(state.askToEcosystem)));
    this.loading$ = this.store.pipe(select(state => fromState.answersAreLoading(state.askToEcosystem) ));
    this.pageIndex$ = this.store.pipe(select(state => fromState.selectPageIndexAnswers(state.askToEcosystem)));
    this.pageSize$ = this.store.pipe(select(state => fromState.selectPageSizeAnswers(state.askToEcosystem)));
    this.totalAnswers$ = this.store.pipe(select(state => fromState.selectCountAnswers(state.askToEcosystem)));
  }

  onEdit(pkQuestion) {
    this.router.navigate(['edit'], { relativeTo: this.route, queryParams: {fromDetails: true} });
  }

  enableAnswerEdition(data: Answer) {
    this.store.dispatch(new AnswersActions.UpdateAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkQuestion: this.pkQuestion,
      data: data
    }));
  }

  onDeleteAnswer(pkAnswer) {
    this.store.dispatch(new AnswersActions.DeleteAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
      pkQuestion: this.pkQuestion,
      pkAnswer: pkAnswer
    }));
  }

  onDeleteQuestion(pkQuestion) {
    this.store.dispatch(new AskActions.DeleteQuestion({
      pkQuestion: pkQuestion,
      pkProject: this.pkService,
      pkTeam: this.pkTeam
    }));
    this.location.back();
  }

  onNewAnswer(data) {
    this.store.dispatch(new AnswersActions.CreateAnswer({
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
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
      pkTeam: this.pkTeam,
      pkProject: this.pkService,
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
      pkAnswer: pkAnswer,
      rating: rating
    }));
  }

  goBack() {
    this.location.back();
  }
}
