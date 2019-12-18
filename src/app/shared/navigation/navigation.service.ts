import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Urls, UrlService } from '@app/core';

@Injectable()
export class NavigationService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private translateService: TranslateService
  ) {
  }

  /**
   * navigates to platform or ecosystem profile depending on context
   */
  goToProfile(userSlug: string, untranslatedLocation?: string, newTab?: boolean): void {
    /** if its in project context, open the profile within the project */
    if (this.isInProjectContext()) {
      this.goToProfileWithinPlatform(userSlug, untranslatedLocation, newTab);
    } else {
      const urlEcosystemProfile: string = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_VIEW, userSlug]);
      newTab ?
        window.open(urlEcosystemProfile, '_blank')
        :
        this.router.navigate([urlEcosystemProfile]);
    }
  }

  /**
   * navigates to platform or ecosystem profile depending on context
   */
  goToAccountSettings(userPk: string, untranslatedLocation?: string): void {
    /** if its in project context, open the profile within the project */
    if (this.isInProjectContext()) {
      this.goToAccountSettingsWithinPlatform(userPk, untranslatedLocation);
    } else {
      const urlEcosystemProfile: string = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_ACCOUNT, userPk]);
      this.router.navigate([urlEcosystemProfile]);
    }
  }

  /**
   * directs us to profile in platform service context
   * @param userSlug
   * @param untranslatedLocation
   * @param newTab
   */
  private goToProfileWithinPlatform(userSlug: string, untranslatedLocation: string, newTab?: boolean): void {
    const params: { pkService: string, pkTeam: string } = this.getParamsForServiceUrlBuild(this.route.snapshot);
    const urlBase = this.router.url.includes(Urls.BASE_GENERIC_PROJECT) ?
      Urls.PROFILE_WITHIN_PLATFORM_GENERIC_SERVICE :
      Urls.PROFILE_WITHIN_PLATFORM_SERVICE;
    const url = this.urlService.getPath([urlBase, params.pkService, params.pkTeam, userSlug]);

    if (newTab) {
      window.open(url, '_blank');
    } else {
      this.router.navigate([url], {
        queryParams: {
          goBack: this.translateService.instant(untranslatedLocation),
          isInProjectContext: true,
        }
      });
    }
  }

  /**
   * navigate to account settings within platform
   * @param userPk
   * @param untranslatedLocation
   */
  private goToAccountSettingsWithinPlatform(userPk: string, untranslatedLocation: string): void {
    const params: { pkService: string, pkTeam: string } = this.getParamsForServiceUrlBuild(this.route.snapshot);
    const urlBase = this.router.url.includes(Urls.BASE_GENERIC_PROJECT) ?
      Urls.ACCOUNT_SETTINGS_WITHIN_PLATFORM_GENERIC_SERVICE :
      Urls.ACCOUNT_SETTINGS_WITHIN_PLATFORM_SERVICE;

    const url = this.urlService.getPath([urlBase, params.pkService, params.pkTeam, userPk]);
    this.router.navigate([url], {queryParams: {goBack: this.translateService.instant(untranslatedLocation)}});
  }

  /**
   * gets the necessary params to build the url
   * @param routeSnapshot
   */
  public getParamsForServiceUrlBuild(routeSnapshot: ActivatedRouteSnapshot): any {
    return routeSnapshot.params['pkService'] ?
      routeSnapshot.params :
      this.getParamsForServiceUrlBuild(routeSnapshot.children[0]);
  }

  /**
   * determines weather the user is in the context of a project by checking the router snapshot
   * @returns {boolean}
   */
  public isInProjectContext(): boolean {
    let isInProject = false;
    let currentIteration: ActivatedRouteSnapshot = this.route.snapshot;
    while (currentIteration && !isInProject) {
      if (currentIteration.data['project']) {
        isInProject = true;
      } else {
        currentIteration = currentIteration.children ? currentIteration.children[0] : undefined;
      }
    }
    return isInProject;
  }

}
