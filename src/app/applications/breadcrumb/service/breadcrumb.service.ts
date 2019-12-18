import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';


import { AppState } from '@core/store/reducers';
import { Urls } from '@core/services';

import { IBreadCrumb } from '../store/breadcrumb.reducers';
import * as crumbActions from '../store/breadcrumb.actions';
import * as fromBreadCrumb from '../store/breadcrumb.reducers';

const FirstLevelUrls = [
  Urls.ECOSYSTEM_CIRCLES,
  Urls.ECOSYSTEM_CIRCLES_FEED,
  Urls.ECOSYSTEM_CIRCLES_SUMMARY,
  Urls.ECOSYSTEM_DIRECTORY,
  Urls.ECOSYSTEM_JOBS,
  Urls.ECOSYSTEM_EVENTS_LIST,
  Urls.ECOSYSTEM_OPPORTUNITIES,
  Urls.ECOSYSTEM_OPPORTUNITIES_ALL,
  Urls.ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU,
  Urls.ECOSYSTEM_TOOLS
];
const FirstLevelUrlsInSubmenu = [
  Urls.ECOSYSTEM_EXQ,
  Urls.ECOSYSTEM_EXQ_LIST,
  Urls.ECOSYSTEM_MEDIA,
  Urls.ECOSYSTEM_WORKSPACE_PROJECTS
];

@Injectable()
export class BreadCrumbService {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private translateService: TranslateService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // reset breadcrumb always, in case you navigate from child -> child
      if (!this.isNavigationBetweenTabChildren(event.url)) {
        this.resetBreadcrumb();
      }
      if (FirstLevelUrls.indexOf(event.url) === -1 || FirstLevelUrls.indexOf(event.urlAfterRedirects) === -1) {
        const splitUrl = this.splitUrl(event.url);
        // Add parent breadcrumb(Opportunities, circles, etc)
        this.addRootCrumb(`/${splitUrl[0]}/${splitUrl[1]}`);
      }
      if (FirstLevelUrlsInSubmenu.indexOf(event.url) === -1 ||
        FirstLevelUrlsInSubmenu.indexOf(event.urlAfterRedirects) === -1
      ) {
        const splitUrl = this.splitUrl(event.url);
        // Add parent breadcrumb(tools, resources ...)
        this.addRootCrumb(`/${splitUrl[0]}/${splitUrl[1]}/${splitUrl[2]}`);
      }
    });
  }

  splitUrl(url: string) {
    return url.split('/').filter(function(i) { return i.length > 0; });
  }

  updateBreadCrumb(data: IBreadCrumb): void {
    if (!data.url) {
      data.url = this.router.url.indexOf('?') !== -1 ?
        this.router.url.substring(0, this.router.url.indexOf('?')) :
        this.router.url;
    }
    this.store.dispatch(new crumbActions.Update(data));
  }

  /**
   * Remove last item from breadcrumb.
   */
  popLastCrumb(): void {
    this.store.dispatch(new crumbActions.PopCrumb());
  }

  /**
   * Add an item to the breadcrumbs displayed
   */
  appendCrumb(crumbToAdd: string): void {
    this.store.dispatch(new crumbActions.PushCrumb({ label: crumbToAdd }));
  }

  addRootCrumb(url: string): void {
    this.store.dispatch(new crumbActions.UpdateRoot(this.rootCrumbs(url)));
  }

  getBreadCrumb(): Observable<IBreadCrumb[]> {
    return this.store.pipe(select(state => fromBreadCrumb.getCrumbs(state)));
  }

  replaceLastCrumb(newCrumb: string): void {
    this.popLastCrumb();
    this.appendCrumb(newCrumb);
  }

  rootCrumbs(url: string): IBreadCrumb | void {
    switch (url) {
      case Urls.ECOSYSTEM_CIRCLES:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.CIRCLES.TITLE'),
          url: Urls.ECOSYSTEM_CIRCLES
        };
      case Urls.ECOSYSTEM_OPPORTUNITIES:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.OPPORTUNITIES'),
          url: this.router.url.search(Urls.ECOSYSTEM_OPPORTUNITY_ADMIN_REGEXP) > -1 ?
            Urls.ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU :
            Urls.ECOSYSTEM_OPPORTUNITIES
        };
      case Urls.MEDIA:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.MEDIA'),
          url: Urls.MEDIA
        };
      case Urls.DIRECTORY:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.DIRECTORY'),
          url: Urls.DIRECTORY
        };
      case Urls.ECOSYSTEM_JOBS:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.JOBS.TITLE'),
          url: Urls.ECOSYSTEM_JOBS
        };
      case Urls.ECOSYSTEM_EVENTS_LIST:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EVENTS.TITLE'),
          url: Urls.ECOSYSTEM_EVENTS_LIST
        };
      case Urls.ECOSYSTEM_TOOLKIT:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.TOOLKIT.TITLE'),
          url: Urls.ECOSYSTEM_TOOLKIT
        };
      case Urls.ECOSYSTEM_EXQ:
      case Urls.ECOSYSTEM_EXQ_LIST:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EXQ.TITLE'),
          url: Urls.ECOSYSTEM_EXQ
        };
      case Urls.ECOSYSTEM_WORKSPACE_PROJECTS:
        return {
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.WORKSPACE.TITLE'),
          url: Urls.ECOSYSTEM_WORKSPACE_PROJECTS
        };
      default:
        return;
    }
  }

  isNavigationBetweenTabChildren(url: string): boolean {
    return url.search(Urls.ECOSYSTEM_EVENT_PROFILE_REGEXP) > -1 ||
      url.search(Urls.ECOSYSTEM_OPPORTUNITY_ADMIN_REGEXP) > -1 ||
      url.search(Urls.ECOSYSTEM_WORKSPACE_PROJECTS_REGEXP) > -1;
  }

  resetBreadcrumb(): void {
    this.store.dispatch(new crumbActions.Reset());
  }
}
