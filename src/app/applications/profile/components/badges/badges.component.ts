import { Component, Input, OnDestroy, OnInit, Inject } from '@angular/core';
import { MediaObserver, BreakPoint, DEFAULT_BREAKPOINTS, ɵMatchMedia } from '@angular/flex-layout';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs';

import { ConsultantModel } from '@applications/shared/models';
import { BadgeModel } from '@applications/shared/models/badge.model';

import { BadgeDetailDialogComponent } from './badge-detail-dialog/badge-detail-dialog.component';

import { BADGES_CONFIG } from './badges.conf';
import { RoleEnum } from '@core/modules/roles/enums';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent implements OnDestroy, OnInit {

  @Input() profileUser: ConsultantModel;
  subscriptions = new Subscription();
  badgesToDisplay: Array<BadgeModel> = [];
  badges: Array<BadgeModel> = [];
  sliceItems = 8;
  collapse = true;
  totalBadgesActivity = 0;
  roleEnum = RoleEnum;

  constructor(
    private mediaMatch: ɵMatchMedia,
    private mediaObserver: MediaObserver,
    private dialog: MatDialog,
    @Inject(BADGES_CONFIG) private badgesConfig
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.mediaObserver.media$.subscribe(() => {
      if (this.isResolutionActive('md')) {
        this.sliceItems = 6;
      } else if (this.isResolutionActive('sm')) {
        this.sliceItems = 4;
      } else if (this.isResolutionActive('gt-lg') || this.isResolutionActive('lt-sm')) {
        this.sliceItems = 8;
      }
      this.collapse = true;
      if (this.badgesToDisplay.length) {
        this.badges = this.badgesToDisplay.slice(0, this.sliceItems);
      }
    }));

    this.badgesToDisplay = this.profileUser ? this.profileUser.badgesActivity : [];
    (<ConsultantModel>this.profileUser).badgesActivity.map(badge => this.totalBadgesActivity += badge.num);
    this.sort();
  }

  private isResolutionActive(resolution): boolean {
    return this.mediaMatch.isActive(DEFAULT_BREAKPOINTS
      .find((bp: BreakPoint) => bp.alias === resolution ).mediaQuery);
  }

  private sort(): void {
    this.badgesToDisplay.sort((a, b) => {
      if (a.order < b.order) { return -1; }
      if (a.order > b.order) { return 1; }
      if (a.num > b.num) { return - 1; }
      if (a.num < b.num) { return 1; }
    });
  }

  getInitials(badge: BadgeModel): string {
    const role = this.roleEnum.enums[badge.role];
    return role.split(/\s/).slice(0, 2).reduce((response, word) => response += word.slice(0, 1), '');
  }

  showMoreBadges(): void {
    this.showBadges();
    this.collapse = !this.collapse;
  }

  showBadges(): void {
    if (this.collapse) {
      this.badges = this.badgesToDisplay;
    } else {
      this.badges = this.badgesToDisplay.slice(0, this.sliceItems);
    }
  }

  goToDetail(badge: BadgeModel): void {
    this.dialog.open(BadgeDetailDialogComponent, {
      autoFocus: false,
      data: {
        badge: badge
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getCategoryColor(key): string {
    return this.badgesConfig.categoryColor[key];
  }
}
