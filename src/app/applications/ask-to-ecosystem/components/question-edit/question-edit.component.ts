import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';

import * as fromState from '../../store/reducer/index';
import * as AskActions from '../../store/action/questions.action';
import { Params } from '@angular/router';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent implements OnInit {
  question$: Observable<Post>;
  private pkProject: number;
  private pkTeam: number;
  private pkQuestion: number;
  backLabel: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkProject = +params.get('pkService');
      this.pkQuestion = +params.get('pk');
      this.pkTeam = +params.get('pkTeam');
      this.store.dispatch(new AskActions.SelectQuestion({
        pkTeam: this.pkTeam,
        pkProject: this.pkProject,
        pkQuestion: this.pkQuestion
      }));
    });

    this.question$ = this.store.pipe(
        select(state => fromState.selectQuestionSelected(state.askToEcosystem.questions)));

    this.route.queryParams.subscribe((params: Params) =>
      this.backLabel = 'PROJECT.ASK_ECOSYSTEM.'.concat(params.fromDetails ? 'TITLE_DETAILS' : 'TITLE'));
  }

  onSaved(data) {
    this.store.dispatch(new AskActions.EditQuestion({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      pkQuestion: this.pkQuestion,
      data: data
    }));

    this.location.back();
  }

  onCancel(data) {
    this.location.back();
  }
}
