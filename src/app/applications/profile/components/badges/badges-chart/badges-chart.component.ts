import { Component, OnInit, Input, Inject } from '@angular/core';
import { KeyValue } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { BadgeModel } from '@applications/shared/models/badge.model';

import { BADGES_CONFIG } from '../badges.conf';
import { RoleCategoryEnum } from '@core//modules/roles/enums';

@Component({
  selector: 'app-badges-chart',
  templateUrl: './badges-chart.component.html',
  styleUrls: ['./badges-chart.component.scss']
})
export class BadgesChartComponent implements OnInit {

  @Input() badges: Array<BadgeModel> = [];
  categoryCounter: {[category: string]: number; } = {};
  colors = {};
  data: Array<any> = [];
  categories = 0;

  constructor(
    private translate: TranslateService,
    @Inject(BADGES_CONFIG) private badgesConfig
  ) { }

  ngOnInit() {
    this.groupBadgeCategories();
    this.initColors();
    this.initData();
  }

  private initColors(): void {
    const col = [];
    Object.keys(this.categoryCounter).map(key => {
      switch (key) {
        case RoleCategoryEnum.enums.SPRINT:
          col.push(this.badgesConfig.categoryColor[RoleCategoryEnum.enums.SPRINT]);
          break;
        case RoleCategoryEnum.enums.WORKSHOP:
          col.push(this.badgesConfig.categoryColor[RoleCategoryEnum.enums.WORKSHOP]);
          break;
        case RoleCategoryEnum.enums.FASTRACK:
          col.push(this.badgesConfig.categoryColor[RoleCategoryEnum.enums.FASTRACK]);
          break;
        case RoleCategoryEnum.enums.SWARM:
          col.push(this.badgesConfig.categoryColor[RoleCategoryEnum.enums.SWARM]);
          break;
        case RoleCategoryEnum.enums.SUMMIT:
          col.push(this.badgesConfig.categoryColor[RoleCategoryEnum.enums.SUMMIT]);
          break;
        case RoleCategoryEnum.enums.COMMUNITY:
          col.push(this.badgesConfig.categoryColor[RoleCategoryEnum.enums.COMMUNITY]);
          break;
      }
    });
    if (col.length) {
      this.colors = { domain: col };
    }
  }

  private initData(): void {
    this.data = Object.keys(this.categoryCounter).map(key => {
      return {
        'name': this.translate.instant(`PROFILE.PLATFORM.BADGES.SUBTITLE.${key}`),
        'value': this.categoryCounter[key]
      };
    });
  }

  valueOrder = (a: KeyValue<string, number>, b: KeyValue<string, number>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }

  private groupBadgeCategories(): void {
    this.badges.map(badge => {
      badge.category in this.categoryCounter
        ? this.categoryCounter[badge.category] += badge.num
        : this.categoryCounter[badge.category] = badge.num;
    });
    this.categories = Object.keys(this.categoryCounter).length;
  }

  getCategoryColor(key): string {
    return this.badgesConfig.categoryColor[key];
  }
}
