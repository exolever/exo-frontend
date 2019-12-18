import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Store } from '@ngrx/store';

import { Urls } from '@core/services/navigate';
import { AppState } from '@core/store/reducers';

import * as CirclesActions from '../../store/action/circles.action';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  tabs = [];

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new CirclesActions.LoadCircles());
    this.tabs = [
      {
        label: this.translate.instant('ECOSYSTEM.CIRCLES.FEED'),
        link: Urls.ECOSYSTEM_FEED
      },
      {
        label: this.translate.instant('ECOSYSTEM.CIRCLES.SUMMARY'),
        link: Urls.ECOSYSTEM_SUMAMRY
      }
    ];
  }
}
