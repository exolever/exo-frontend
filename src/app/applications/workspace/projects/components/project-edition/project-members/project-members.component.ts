import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter, tap } from 'rxjs/operators';

import { BreakPointService } from '@applications/break-point/break-point.service';
import * as UserActions from '@applications/workspace/projects/store/action/user.action';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';

import { AppState } from '@core/store/reducers';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import { ProjectMember } from '../../../models/project-member.model';

// tslint:disable-next-line:max-line-length
import { ParticipantDialogFormComponent } from '../../shared/participant-dialog-form/participant-dialog-form.component';
// tslint:disable-next-line:max-line-length
import { CollaboratorDialogFormComponent } from '../../shared/collaborator-dialog-form/collaborator-dialog-form.component';
import { TeamRoleInterface } from '@applications/workspace/projects/models/project.interface';

@Component({
  selector: 'app-project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.scss']
})
export class ProjectMembersComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {
  projectPk: number;
  members$: Observable<{member: ProjectMember, description: string}[]>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalUsers$: Observable<number>;
  emptyMoment$: Observable<boolean>;
  text$: Observable<string>;
  loading$: Observable<boolean>;
  searchBox = new FormControl('');
  subscriptions = new Subscription();
  showAlertNoTeam;
  constructor(
    private breakPointService: BreakPointService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private promptDialogService: PromptDialogService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectPk = +params.projectPk;
      this.store.dispatch(new UserActions.Load(this.projectPk));
    });

    this.emptyMoment$ = this.store.pipe(select(state => fromStore.usersEmptyMoment(state.workspaceProjects)));
    this.loading$ = this.store.pipe(select(state => fromStore.usersAreLoading(state.workspaceProjects)));
    this.pageIndex$ = this.store.pipe(select(state => fromStore.selectPageIndexUsers(state.workspaceProjects)));
    this.pageSize$ = this.store.pipe(select(state => fromStore.selectPageSizeUsers(state.workspaceProjects)));
    this.totalUsers$ = this.store.pipe(select(state => fromStore.selectCountUsers(state.workspaceProjects)));
    this.text$ = this.store.pipe(select(state => fromStore.selectSearchByUsers(state.workspaceProjects)));

    this.subscriptions.add(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value =>
        this.store.dispatch(new UserActions.SetSearch({projectPk: this.projectPk, searchBy: value}))
      )
    );

    this.members$ = this.store.pipe(select(state => fromStore.selectAllUsers(state.workspaceProjects))).pipe(
      map((members: ProjectMember[]) => this.getMembers(members))
    );
  }

  getMembers (members: ProjectMember[]) {
    this.showAlertNoTeam = undefined;
    return members.map(m => ({member: m, description: this.getDescription(m)}));
  }

  getDescription(member: ProjectMember): string {
    const labelAt = this.translate.instant('COMMON.AT');
    const noTeamLabel = this.translate.instant(
      'ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.NO_TEAM_SELECTED').toLowerCase();
    const noTeam = `<span class="no-team">${noTeamLabel}</span>`;
    const descriptions = [];
    member.projectRoles.map(pR => {
      if (pR.code === SprintRoleEnum.SPRINT_COACH_SPRINT ||
        pR.code === SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT
      ) {
        const associatedTeams: TeamRoleInterface[] = member.teamRoles.filter(tR => tR.exoRole.code === pR.code);
        if (associatedTeams.length > 0) {
          associatedTeams.map((t: TeamRoleInterface) => {
            descriptions.push(`${pR.name} ${labelAt} ${t.name}`);
          });
        } else {
          descriptions.push(`${pR.name} ${labelAt} ${noTeam}`);
        }
        this.evaluateShowAlert(associatedTeams);

      } else {
        descriptions.push(pR.name);
      }
    });
    return descriptions.join(', ');
  }

  evaluateShowAlert(associatedTeams) {
    if (this.showAlertNoTeam === undefined && associatedTeams.length === 0) {
      this.showAlertNoTeam = true;
    }
    this.cd.detectChanges();
  }

  openParticipantForm(title: string, member?: ProjectMember) {
    const projectPk = this.projectPk;
    const teams = member ? member.teamRoles.map(tR => tR.teamPk) : [];
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(ParticipantDialogFormComponent, {
        projectPk: projectPk,
        title: title,
        member: member,
        teamsForMember: teams
      }).subscribe()
    );
  }

  openCollaboratorForm(title: string, member?: ProjectMember) {
    const projectPk = this.projectPk;
    const roles = member ? member.projectRoles.map(role => role.code) : [];
    const teams = member ? member.teamRoles.map(team => team.teamPk) : [];
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

  onNewParticipant() {
    const title = this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.CREATE_EXO_PARTICIPANT');
    this.openParticipantForm(title);
  }

  onNewCollaborators() {
    const title = this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.CREATE_EXO_COLLABORATOR');
    this.openCollaboratorForm(title);
  }

  onEdit(member: ProjectMember) {
    if (member.canEditCollaborator()) {
      const title = this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.EDIT_EXO_COLLABORATOR');
      this.openCollaboratorForm(title, member);
    } else {
      const title = this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.EDIT_EXO_PARTICIPANT');
      this.openParticipantForm(title, member);
    }
  }

  onDelete(member: ProjectMember) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.TITLE_WARNING_DELETE'),
        messages: [this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.DESCRIPTION_WARNING_DELETE')],
        secondaryButton: this.translate.instant('COMMON.ACTIONS.CANCEL'),
        primaryButton: this.translate.instant('COMMON.ACTIONS.DELETE')
      }).pipe(
        filter((result) => result === true),
        tap(() => this.store.dispatch(new UserActions.Delete({projectPk: this.projectPk, member: member})))
      ).subscribe()
    );
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new UserActions.SetPagination({
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize,
      projectPk: this.projectPk
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
