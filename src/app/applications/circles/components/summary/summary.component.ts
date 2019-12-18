import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import { UserModel } from '@core/models/user/user.model';

import * as QuestionActions from '../../store/action/questions.action';
import * as fromStore from '../../store/reducer/index';
import { Circle } from '../../models/circle.model';

@Component({
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  circles$: Observable<Circle[]>;
  loading$: Observable<boolean>;
  user$: Observable<UserModel>;
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.circles$ = this.store.pipe(select(state => fromStore.selectAllCircles(state.circles)));
    this.loading$ = this.store.pipe(select(state => fromStore.circlesAreLoading(state.circles)));
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
  }

  onSeeDetails(circleSlug: string, questionSlug: string) {
    // Tracking: (ActionGA.DetailsFromSummary, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });
    this.router.navigate([`${circleSlug}/${questionSlug}`], { relativeTo: this.route.parent });
  }

  onEdit(circleSlug: string, questionSlug: string) {
    // Tracking: (ActionGA.EditionFromSummary, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });
    this.router.navigate([`${circleSlug}/${questionSlug}/edit`], { relativeTo: this.route.parent });
  }

  onDelete(pkPost: number) {
    // Tracking: (ActionGA.DeletionFromSummary, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });
    this.store.dispatch(new QuestionActions.DeleteQuestion(pkPost));
  }
}
