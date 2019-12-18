import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { TeamModel } from '@service/old-project/models/team.model';
import { ProjectModel } from '@applications/service/old-project/models/project.model';
import { groupBy } from '@shared/utils/array-groupBy';
import { uniqueElementsBy } from '@shared/utils/array-uniqueElementsBy';
import { MemberCardInterface } from '@service/shared/modules/member-card/member-card.inteface';

import { CONSULTANT_MEMBER_TYPE, FilterTeamInterface, USER_MEMBER_TYPE } from '../../interfaces';
import { DeserializeTeamService, TeamService } from '../../services';
import { ParticipantMemberModel } from '../../models/participant-member.model';
import { ConsultantMemberModel } from '../../models/consultant-member.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';


@Component({
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit, OnDestroy {
  @ViewChild('mdSelectTeam', {static: false}) mdSelectTeam: MatSelect;
  private everyBody = this.translateService.instant('ECOSYSTEM.DIRECTORY.EVERYBODY');
  private subscriptions: Subscription[] = [];
  filters: Array<FilterTeamInterface> = [{ code: '', label: this.everyBody, memberType: '' }];
  filteredValue = ''; // Everybody by default.
  filterSelected = this.everyBody;
  filteredValueData = {};
  availableFilters = [];
  members: Array<ConsultantMemberModel | ParticipantMemberModel> = [];
  rolesUsedByConsultant = [];
  rolesUsedByUser = [];
  project: ProjectModel;

  // TODO: Take into account TeamGProjectModel for new projects
  teams: TeamModel[];

  constructor(
    private teamService: TeamService,
    private deserializeTeamService: DeserializeTeamService,
    private router: ActivatedRoute,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.router.parent.params.subscribe(data => {
      this.loadDataForPlatform(data.pkService);
    });
  }

  loadDataForPlatform(pkService) {
    this.subscriptions.push(
      this.teamService.getPlatformMembers(pkService).subscribe(
        res => {
          this.parseData(res);
          this.createFilter(res);
        },
        err => {
          this.members = [];
          console.error(err);
        }
      )
    );
  }

  parseData(data): void {
    this.members = this.deserializeTeamService.parseData(data);
    this.members = this.removeAndMergeRolesDuplicateMembers(this.members);
    // To get roles used by consultants/users, in order to show them into the filter
    this.rolesUsedByConsultant = this.deserializeTeamService.parseRolesUsedByConsultant(data);
    this.rolesUsedByUser = this.deserializeTeamService.parseRolesUsedByUser(data);
  }

  removeAndMergeRolesDuplicateMembers(members) {
    const dictionaryMembers = groupBy(members, 'pk');
    const duplicatesMembers = Object.keys(dictionaryMembers).filter((key) => {
      return dictionaryMembers[key].length > 1;
    });
    // Merge the role and roleCode in the first item.
    duplicatesMembers.forEach((i) => {
      dictionaryMembers[i][0].role = [dictionaryMembers[i][0].role];
      dictionaryMembers[i][0].roleCode = [dictionaryMembers[i][0].roleCode];
      dictionaryMembers[i].map((consultant, index ) => {
        if (index === 0) {
          return;
        }
        dictionaryMembers[i][0].role.push(consultant.role);
        dictionaryMembers[i][0].roleCode.push(consultant.roleCode);
      });
    });
    // Get the first element from duplicates.
    return uniqueElementsBy(this.members, (a, b) => a.pk === b.pk);
  }

  createFilter(data): void {
    this.createFilterForConsultantRole();
    this.createFilterForUserRole();
    this.createFilterForTeams(data.teams.edges);
  }
  createFilterForConsultantRole(): void {
    this.rolesUsedByConsultant.map(cRole => {
      if (!this.filters.find(opt => opt.code === cRole.code)) {
        this.filters.push({ code: cRole.code, label: cRole.name, memberType: CONSULTANT_MEMBER_TYPE });
        this.availableFilters.push(cRole.code);
      }
    });
  }

  createFilterForUserRole(): void {
    this.rolesUsedByUser.filter(role => {
      return SprintRoleEnum[role.code] !== SprintRoleEnum.toString(SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT);
    }).map(uRole => {
      if (!this.filters.find(opt => opt.code === uRole.code)) {
        this.filters.push({ code: uRole.code, label: uRole.name, memberType: USER_MEMBER_TYPE });
        this.availableFilters.push(uRole.code);
      }
    });

  }

  createFilterForTeams(teams): void {
    this.teams = teams.map(team => new TeamModel(team.node));

    teams.map(team => {
      this.filters.push({ code: team.node.pk, label: team.node.name, memberType: '' });
    });
  }
  deserializeTeams(member: ConsultantMemberModel | ParticipantMemberModel): TeamModel[] {
    return member.teams.map((idTeam) => this.teams.find((team) => team.pk === idTeam));
  }

  deserializeRoles(member: ConsultantMemberModel | ParticipantMemberModel): string {
    return Array.isArray(member.role) ? member.role.join(', ') : member.role;
  }

  deserializerItemCard(member: ConsultantMemberModel| ParticipantMemberModel): MemberCardInterface {
    const extraInformation = [];
    const teams = this.deserializeTeams(member);
    if (teams.length > 0) {
      const teamsList = teams.map(t => t.name).join(', ');
      extraInformation.push({
        icon: 'supervisor_account',
        description: teamsList,
        tooltip: this.translateService.instant('ECOSYSTEM.DIRECTORY.CARD.TEAMS')
      });
    }
    return {
      user: member,
      description: this.deserializeRoles(member),
      extraInformation: extraInformation
    };
  }

  belongEcosystem(member: ConsultantMemberModel| ParticipantMemberModel): boolean {
    const rolesToExclude = [
      SprintRoleEnum.toString(SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT),
      SprintRoleEnum.toString(SprintRoleEnum.OBSERVER_SPRINT),
      SprintRoleEnum.toString(SprintRoleEnum.DELIVERY_MANAGER_SPRINT)];
    const roles =  this.deserializeRoles(member);
    return member && !(rolesToExclude.includes(roles));
  }

  onChange(event) {
    this.filteredValueData['memberType'] = event.source.selected._element.nativeElement.memberType;
    this.filteredValueData['value'] = this.filteredValue;
  }

  ngOnDestroy(): void {
    // To avoid change the page shown the loader
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  changeFilters(filter: FilterTeamInterface) {
    this.filterSelected = filter.label;
    this.filteredValueData['memberType'] = filter.memberType;
    this.filteredValueData['value'] = this.filteredValue = filter.code;
  }

}
