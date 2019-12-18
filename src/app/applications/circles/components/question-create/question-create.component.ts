import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { UserModel } from '@core/models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@core/store/reducers';

import { Circle } from '../../models/circle.model';
import * as AskActions from '../../store/action/questions.action';
import * as CircleActions from '../../store/action/circles.action';
import * as fromState from '../../store/reducer/index';

import { TranslateService } from '@ngx-translate/core';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { UrlService, ApiResources } from '@core/services/api/resolve';


@Component({
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent implements OnInit, OnDestroy {
  user$: Observable<UserModel>;
  circle$: Observable<Circle>;
  mentionsAPI: string;
  private circleSlug: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>,
    private translateService: TranslateService,
    private urlService: UrlService,
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.breadCrumbService.appendCrumb(
      this.translateService.instant('ECOSYSTEM.BREADCRUMBS.CIRCLES.CREATE')
    );
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.circleSlug = params.get('circleSlug');
      this.mentionsAPI = this.urlService.resolveAPI(ApiResources.CIRCLE_FOLLOWERS, this.circleSlug);
      this.store.dispatch(new CircleActions.SelectCircle(this.circleSlug));
    });
    this.circle$ = this.store.pipe(
      select(state => fromState.selectCircleSelected(state.circles.circles))
    );

  }

  onSaved(data) {
    this.store.dispatch(new AskActions.CreateQuestion({
      circleSlug: this.circleSlug,
      data: data
    }));

    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.breadCrumbService.popLastCrumb();
  }
}
