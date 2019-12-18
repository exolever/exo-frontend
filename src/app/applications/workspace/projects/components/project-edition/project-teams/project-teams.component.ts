import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';

import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { BreakPointService } from '@applications/break-point/break-point.service';
import { AppState } from '@core/store/reducers';

import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';
import { Team} from '@applications/workspace/projects/models/team.model';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import * as TeamActions from '@applications/workspace/projects/store/action/team.action';
import * as UserActions from '@applications/workspace/projects/store/action/user.action';
import {
  CollaboratorDialogFormComponent
} from '@applications/workspace/projects/components/shared/collaborator-dialog-form/collaborator-dialog-form.component';
import {
  ParticipantDialogFormComponent
} from '@applications/workspace/projects/components/shared/participant-dialog-form/participant-dialog-form.component';
import { TeamEditionDialogComponent } from './team-edition-dialog/team-edition-dialog.component';
import { UserSelectionDialogComponent } from './users-selection-dialog/users-selection-dialog.component';
import { ProjectMemberActionsEnum, TeamActionsEnum } from '@applications/workspace/projects/projects.enum';
import { TeamMemberRoleInterface } from '@applications/workspace/projects/models/project.interface';
import { UserModel } from '@core/models';

@Component({
  selector: 'app-project-teams',
  templateUrl: './project-teams.component.html',
  styleUrls: ['./project-teams.component.scss']
})
export class ProjectTeamsComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  teams$: Observable<Team[]>;
  loading$: Observable<boolean>;
  emptyMoment$: Observable<boolean>;
  projectPk: number;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private promptDialogService: PromptDialogService,
    private breakPointService: BreakPointService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectPk = +params.projectPk;
      this.store.dispatch(new TeamActions.Load(this.projectPk));
      this.store.dispatch(new UserActions.Load(this.projectPk));
    });

    this.teams$ = combineLatest(
      this.store.pipe(select(state => fromStore.selectAllTeams(state.workspaceProjects))),
      this.store.pipe(select(state => fromStore.selectAllUsers(state.workspaceProjects)))
    ).pipe(
      map(([teams, users]: [Team[], ProjectMember[]]) => {
        teams.forEach(team =>
          team.users.forEach(teamMemberRole => {
            const objectFound = users.find(projectMember => projectMember.user.pk === teamMemberRole.uuidUser);
            teamMemberRole.projectMember = objectFound ? objectFound : undefined;
          }));
        return teams;
      })
    );

    this.loading$ = this.store.pipe(select(state => fromStore.teamsAreLoading(state.workspaceProjects)));
    this.emptyMoment$ = this.store.pipe(select(state => fromStore.emptyMoment(state.workspaceProjects)));
  }

  showSelectMembers(team: Team): boolean {
    return team.userActions.some(action => action === TeamActionsEnum.PARTICIPANTS);
  }

  onMemberAction(action: ProjectMemberActionsEnum, team: Team, teamRole: TeamMemberRoleInterface) {
    switch (action) {
      case ProjectMemberActionsEnum.DELETE_MEMBER:
          this.onDeleteParticipant(team, teamRole);
        break;
      case ProjectMemberActionsEnum.EDIT_COLLABORATOR:
        this.openCollaboratorForm(
          this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.EDIT_COLLABORATOR_TITLE'),
          [team.pk],
          [teamRole.role.code],
          teamRole.projectMember,
        );
        break;
      case ProjectMemberActionsEnum.EDIT_USER_DATA_FOR_PARTICIPANT:
      case ProjectMemberActionsEnum.EDIT_TEAM_FOR_PARTICIPANT:
        this.openParticipantForm(
          this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.EDIT_PARTICIPANT_TITLE'),
          [team.pk],
          teamRole.projectMember
        );
        break;
    }
  }

  onTeamAction(action: TeamActionsEnum, team: Team) {
    switch (action) {
      case TeamActionsEnum.DELETE:
        this.onDelete(team);
        break;
      case TeamActionsEnum.EDIT:
        this.onEdit(team);
        break;
      case TeamActionsEnum.PARTICIPANTS:
        this.onSelectUsers(team);
        break;
    }
  }

  onAdd() {
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(TeamEditionDialogComponent, {
        team: undefined,
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.ADD_TITLE'),
        projectPk: this.projectPk
      }).subscribe()
    );
  }

  onEdit(team: Team) {
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(TeamEditionDialogComponent, {
        team: team,
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.EDIT_TITLE'),
        projectPk: this.projectPk
      }).subscribe()
    );
  }

  onDelete(team: Team) {
      this.subscriptions.add(
        this.promptDialogService.open({
          title: `${this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.DELETE_TITLE')} ${team.name} ?`,
          messages: [this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.DELETE_MESSAGE')],
          secondaryButton: this.translate.instant('COMMON.ACTIONS.CANCEL'),
          primaryButton: this.translate.instant('COMMON.ACTIONS.DELETE')
        }).pipe(
          filter((result) => result === true),
          tap(() => this.store.dispatch(new TeamActions.Delete({team: team, projectPk: this.projectPk}))),
          // tap(() => Tracking: (ActionGA.DeletionFromSummary, {
          //   label: LabelGA.delete_project,
          //   category: CategoryGA.Projects
          // }))
        ).subscribe()
      );
  }

  onSelectUsers(team: Team) {
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(UserSelectionDialogComponent, {
        team: team,
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.SELECT_TITLE'),
        projectPk: this.projectPk
      }).subscribe()
    );
  }

  openParticipantForm(title: string, teams: any[], member?: {user: UserModel}) {
    const projectPk = this.projectPk;
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(ParticipantDialogFormComponent, {
        projectPk: projectPk,
        title: title,
        member: member,
        teamsForMember: teams
      }).subscribe()
    );
  }

  openCollaboratorForm(title: string, teams: any[], roles: any[], member?: ProjectMember) {
    const projectPk = this.projectPk;
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(CollaboratorDialogFormComponent, {
        projectPk: projectPk,
        title: title,
        member: member,
        rolesForMember: roles,
        teamsForMember: teams
      }).subscribe()
    );
  }

  onDeleteParticipant(team: Team, teamRole: TeamMemberRoleInterface) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.UNSELECT_USER_TITLE'),
        messages: [this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.UNSELECT_USER_MESSAGE')],
        secondaryButton: this.translate.instant('COMMON.ACTIONS.CANCEL'),
        primaryButton: this.translate.instant('COMMON.ACTIONS.UNSELECT')
      }).pipe(
        filter((result) => result === true),
        tap(() =>
          this.store.dispatch(new TeamActions.Unselect({
             team: team, projectPk: this.projectPk, teamRolePk: teamRole.pk}))
        )
      ).subscribe()
    );
  }

  isNotGoToAction(action: ProjectMemberActionsEnum) {
    return action !== ProjectMemberActionsEnum.TEAM_MOVE;
  }

  onMoveTo(team: Team, teamRole: TeamMemberRoleInterface, destination: Team) {
    this.store.dispatch(new TeamActions.MoveUser({
      teamPk: team.pk,
      projectPk: this.projectPk,
      teamUserRolePk: teamRole.pk,
      newTeamPk: destination.pk
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
