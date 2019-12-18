import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamModel } from '@service/old-project/models/team.model';
import { Team as TeamGProject } from '@applications/workspace/projects/models/team.model';
import { UserModel } from '@core/models/user/user.model';
import { Urls, UrlService } from '@core/services';

@Component({
  selector: 'app-team-selection-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-selection-bar.component.html',
  styleUrls: ['./team-selection-bar.component.scss']
})
export class TeamSelectionBarComponent implements OnInit, OnChanges {
  /** input data */
  @Input() user: UserModel;
  @Input() teams: TeamModel[] | TeamGProject[];
  @Input() teamSelected: TeamModel;
  @Output() teamSelectionLoaded = new EventEmitter<boolean>();
  @Output() teamChanged = new EventEmitter<string>();

  pkService: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private urlService: UrlService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.pkService = params.get('pkService');
    });
  }

  ngOnChanges() {
    this.teamSelectionLoaded.emit(true);
  }

  selectTeam(team: TeamModel) {
    /**
     * If the team changes, it navigates to the first level of the navigation using the new teamPk
     */
    const firstLevelUrls = {
      'ADVISOR_REQUEST': Urls.BASE_ADVISOR_REQUEST,
      'ASK_ECOSYSTEM': Urls.BASE_ASK_ECOSYSTEM,
      'MEDIA': Urls.BASE_MEDIA,
      'DIRECTORY': Urls.BASE_DIRECTORY,
      'TEAM_TALKS': Urls.BASE_TEAM_TALKS,
      'SWARM_SESSIONS_SERVICE_UNSELECTED': Urls.BASE_SWARM_SESSIONS_SERVICE_UNSELECTED,
      'DELIVER': Urls.BASE_DELIVER,
      'LEARN': Urls.BASE_LEARN,
      'REFLECT': Urls.BASE_REFLECT
    };

    const url = this.router.url;
    let urlWithParameters = url.replace(/[0-9]+/g, '%s');
    let baseUrl;
    if (urlWithParameters.match(Urls.BASE_GENERIC_PROJECT)) {
      baseUrl = Urls.BASE_GENERIC_PROJECT;
      urlWithParameters = urlWithParameters.replace(Urls.BASE_GENERIC_PROJECT, '');
    } else {
      baseUrl = Urls.BASE_SERVICE;
      urlWithParameters = urlWithParameters.replace(Urls.BASE_SERVICE, '');
    }

    const stepPk = url.match(/step\/[0-9]+/g) ? url.match(/step\/[0-9]+/g)[0].match(/[0-9]+/g)[0] : undefined;
    let keyToNavigate = Object.keys(firstLevelUrls)
      .find(key => urlWithParameters.indexOf(firstLevelUrls[key]) !== -1);

    if (!keyToNavigate) { // It doesn't exist any first level because the root of url has been changed
      const otherUrls = {
        'TASK': Urls.TASK
      };
      const correspondenceUrls = {
        'TASK': 'LEARN'
      };
      const keyUrl = Object.keys(otherUrls)
        .filter(key => urlWithParameters.indexOf(otherUrls[key]) !== -1)
        .map(k => correspondenceUrls[k]);
      if (keyUrl.length > 0) {
        keyToNavigate = keyUrl[0];
      }
    }
    if (keyToNavigate) {
      this.teamChanged.next(team.pk);
      const urlToNavigate = `${baseUrl}${firstLevelUrls[keyToNavigate]}`;
      const newUrl = stepPk
        ? this.urlService.getPath([urlToNavigate, this.pkService, team.pk, stepPk])
        : this.urlService.getPath([urlToNavigate, this.pkService, team.pk]);
      this.router.navigate([newUrl]);
    }
  }

  getTeamSelected(): TeamModel | TeamGProject | { name: string } {
    return this.teamSelected ?
      this.teamSelected : ( this.teams && this.teams.length ) ? this.teams[0] : { name: 'No team selected' };
  }
}
