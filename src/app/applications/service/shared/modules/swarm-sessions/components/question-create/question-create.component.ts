import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';

import { UserModel } from '@core/models';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';

import * as AskActions from '../../store/action/questions.action';

@Component({
  selector: 'app-swarm-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent implements OnInit {
  user$: Observable<UserModel>;
  projectName: string;
  private pkProject;
  private pkTeam;
  private pkSession;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pkProject = +params.get('pkService');
      this.pkTeam = +params.get('pkTeam');
      this.pkSession = +params.get('pkSession');
    });
    this.projectName = this.route.snapshot.data.project.name;
  }

  onSaved(data) {
    this.store.dispatch(new AskActions.CreateQuestion({
      pkTeam: this.pkTeam,
      pkProject: this.pkProject,
      pkSession: this.pkSession,
      data: data
    }));

    this.goBack();
  }

  goBack() {
    this.location.back();
  }
}
