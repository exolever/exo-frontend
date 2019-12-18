import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { Circle } from '@applications/circles/models/circle.model';

import * as CircleActions from '../../store/action/circles.action';
import * as fromState from '../../store/reducer/index';


@Component({
  templateUrl: './circle-edit.component.html',
  styleUrls: ['./circle-edit.component.scss']
})
export class CircleEditComponent implements OnInit {
  private slug: string;
  circle$: Observable<Circle>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>,
    private translate: TranslateService,
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.breadCrumbService.appendCrumb(
      this.translate.instant('ECOSYSTEM.BREADCRUMBS.CIRCLES.CREATE')
    );

    this.route.params.subscribe(params => {
      this.slug = params.circleSlug;
      this.store.dispatch(new CircleActions.LoadCircle(this.slug));
      this.store.dispatch(new CircleActions.SelectCircle(this.slug));
    });

    this.circle$ = this.store.pipe(
      select(state => fromState.selectCircleSelected(state.circles.circles))
    );
  }

  goBack() {
    this.location.back();
  }

  onSave(data: Circle) {
    this.store.dispatch(
      new CircleActions.UpdateCircle({slug: this.slug, data: data})
    );
    this.goBack();
  }
}
