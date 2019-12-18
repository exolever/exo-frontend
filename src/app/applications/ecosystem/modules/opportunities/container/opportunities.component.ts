import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Urls, UrlService } from '@app/core';

@Component({
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent implements OnInit {
  tabs: any[];

  constructor(
    private urlService: UrlService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.tabs = [
      {
        label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.ALL'),
        link: Urls.ECOSYSTEM_OPPORTUNITIES_ALL,
      },
    ];
    this.tabs.push({
      label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.PUBLISHED_YOU'),
      link: Urls.ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU,
    });
  }

  onNew() {
    // Tracking: (ActionGA.OpenForm, {
    //   label: CategoryGA.Opportunities,
    //   category: CategoryGA.Opportunities
    // });

    const fromPublishedByYou = this.router.url === Urls.ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU;
    const url = this.urlService.getPath([Urls.ECOSYSTEM_OPPORTUNITY_CREATE]);
    this.router.navigate([url], { state: { fromPublishedByYou: fromPublishedByYou}});
  }
}
