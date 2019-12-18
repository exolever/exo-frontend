import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { Post } from '@forum/interfaces/post.interface';

import * as fromState from '../../store/reducer/index';
import * as AskActions from '../../store/action/questions.action';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { filter, tap } from 'rxjs/operators';
import { UrlService, ApiResources } from '@core/services/api/resolve';

@Component({
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent implements OnInit {
  question$: Observable<Post>;
  mentionsAPI: string;
  private questionPk: number;
  private questionSlug: string;
  private circleSlug: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>,
    private breadCrumbService: BreadCrumbService,
    private urlService: UrlService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.circleSlug = params.get('circleSlug');
      this.questionSlug = params.get('questionSlug');
      this.mentionsAPI = this.urlService.resolveAPI(ApiResources.CIRCLE_FOLLOWERS, this.circleSlug);
      this.store.dispatch(new AskActions.SelectQuestion({
        circleSlug: this.circleSlug,
        questionSlug: this.questionSlug
      }));
    });

    this.question$ = this.store.pipe(
      select(state => fromState.selectQuestionSelected(state.circles.questions)),
      filter((question: Post) => question !== undefined),
      tap((question: Post) => this.questionPk = question.pk)
    );
  }

  onSaved(data) {
    this.store.dispatch(new AskActions.EditQuestion({
      postPk: this.questionPk,
      data: data
    }));

    this.location.back();
  }

  onCancel(data) {
    this.location.back();
    this.breadCrumbService.popLastCrumb();
  }
}
