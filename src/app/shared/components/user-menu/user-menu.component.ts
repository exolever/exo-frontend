import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { Urls, UrlService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models/user/user.model';
import { NavigationService } from '@shared/navigation/navigation.service';
import { ProjectModel } from '@service/old-project/models/project.model';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import * as userActions from '@core/store/user/user.action';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { Campaign } from '@applications/early-parrot/model/campaign.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  selector: 'exo-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ NavigationService ]
})
export class UserMenuComponent implements OnInit, OnChanges {
  @ViewChild('clickHoverMenuTrigger', {static: false}) clickHoverMenuTrigger: MatMenuTrigger;
  @Input()
  user: UserModel;

  @Input()
  project: ProjectModel | GenericProject;

  userRoles: string;
  campaigns$: Observable<Campaign[]>;
  private goBackTranslateString = 'COMMON.PROJECT';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private navService: NavigationService,
    private translate: TranslateService,
    private earlyParrotService: EarlyParrotService
  ) { }

  ngOnInit() {
    this.campaigns$ = this.earlyParrotService.getCampaigns();
  }

  ngOnChanges() {
    if (this.project) {
      if (this.project instanceof ProjectModel) { // Old project
        this.userRoles = this.project.consultantsRoles.
        filter(item => item.userPk === this.user.pk.toString()).
        map(r => r.roleName).join(', ');
      } else {
        this.userRoles = this.project.projectRoles.
        filter(pR => pR.code !== SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT).
        map(pR => pR.name).join(', ');
      }
    }
  }

  /**
    * if user is consultant or superuser go to ecosystem, otherwise stay in platform service view
    */
  viewProfile() {
    if (this.user.isConsultant() || this.user.isSuperuser) {
      const url = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_EDIT, this.user.slug]);
      this.router.navigate(
        [url],
        {queryParams: this.project ? {goBack: this.translate.instant(this.goBackTranslateString)} : undefined}
      );
    } else {
      const params: { pkService: string, pkTeam: string } =
        this.navService.getParamsForServiceUrlBuild(this.route.snapshot);
      const url = this.urlService.getPath(
        [Urls.PROFILE_EDIT_WITHIN_PLATFORM_SERVICE, params.pkService, params.pkTeam, this.user.slug]
      );
      this.router.navigate([url], { queryParams: {
        goBack: this.translate.instant(this.goBackTranslateString),
        isInProjectContext: true,
      }});
    }
  }

  /**
   * if user is consultant or superuser go to ecosystem, otherwise stay in platform service view
   */
  viewAccountSettings() {
    if (this.user.isConsultant() || this.user.isSuperuser) {
      const url = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_ACCOUNT, this.user.pk]);
      this.router.navigate([url],
        {queryParams: this.project ? {goBack: this.translate.instant(this.goBackTranslateString)} : undefined});
    } else {
      this.navService.goToAccountSettings(this.user.pk, this.goBackTranslateString);
    }
  }

  viewMyProjects() {
    this.router.navigate([this.urlService.getPath([Urls.ECOSYSTEM_WORKSPACE_PROJECTS])]);
  }

  viewMyEvents() {
    this.router.navigate([this.urlService.getPath([Urls.ECOSYSTEM_EVENTS_LIST])]);
  }

  viewCampaigns() {
    this.router.navigate([this.urlService.getPath([Urls.REFERRALS])]);
  }

  logout() {
    this.store.dispatch(new userActions.LogoutUser());
  }
}
