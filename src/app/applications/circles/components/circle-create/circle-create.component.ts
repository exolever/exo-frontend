import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import * as CircleActions from '../../store/action/circles.action';
import { Circle } from '@applications/circles/models/circle.model';


@Component({
  templateUrl: './circle-create.component.html',
  styleUrls: ['./circle-create.component.scss']
})
export class CircleCreateComponent implements OnInit {

  constructor(
    private location: Location,
    private store: Store<AppState>,
    private translate: TranslateService,
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.breadCrumbService.appendCrumb(
      this.translate.instant('ECOSYSTEM.BREADCRUMBS.CIRCLES.CREATE')
    );
  }

  goBack() {
    this.location.back();
  }

  onSave(data: Circle) {
    this.store.dispatch( new CircleActions.CreateCircle(data));
  }
}
