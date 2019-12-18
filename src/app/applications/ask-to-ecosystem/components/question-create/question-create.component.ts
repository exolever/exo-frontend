import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { UserModel } from '@core/models';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';

import * as AskActions from '../../store/action/questions.action';



@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent implements OnInit, OnDestroy {
  user$: Observable<UserModel>;
  private subscription: Subscription;
  private pkProject;
  private pkTeam;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkProject = +params.get('pkService');
      this.pkTeam = +params.get('pkTeam');
    });
  }

  onSaved(data) {
    this.store.dispatch(new AskActions.CreateQuestion({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      data: data
    }));

    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
