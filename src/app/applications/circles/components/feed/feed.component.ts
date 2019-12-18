import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { Post } from '@forum/interfaces/post.interface';
import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models';
import * as fromUser from '@core/store/user/user.reducer';

import { CircleService } from '../../services/circle.service';
import * as QuestionActions from '../../store/action/questions.action';
import { Circle } from '../../models/circle.model';
import * as fromStore from '../../store/reducer/index';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  questions$: Observable<Post[]>;
  circles$: Observable<Circle[]>;
  user$: Observable<UserModel>;

  constructor(
    private circleService: CircleService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.questions$ = this.circleService.feed();
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.circles$ = this.store.pipe(select(state => fromStore.selectAllCircles(state.circles)));
  }

  onSeeDetails(circleSlug: string, questionSlug: string) {
    // Tracking: (ActionGA.DetailsFromFeed, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });

    this.router.navigate([`${circleSlug}/${questionSlug}`], { relativeTo: this.route.parent });
  }

  onEdit(questionSlug: string) {
    // Tracking: (ActionGA.EditionFromFeed, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });
    this.router.navigate([`${questionSlug}/edit`], { relativeTo: this.route });
  }

  onDelete(pkPost: number) {
    // Tracking: (ActionGA.DeletionFromFeed, {
    //   label: CategoryGA.Circles,
    //   category: CategoryGA.Circles
    // });

    this.store.dispatch(new QuestionActions.DeleteQuestion(pkPost));
  }

}
