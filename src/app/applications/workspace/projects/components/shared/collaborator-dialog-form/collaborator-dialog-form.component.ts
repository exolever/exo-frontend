import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subscription, Observable, combineLatest } from 'rxjs';
import { debounceTime, map, flatMap, pairwise } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { OverlayReference } from '@overlay/overlay-ref';
import { DATA } from '@overlay/services/overlay.service';
import { ConsultantModel } from '@applications/shared/models/consultant.model';
import { ConsultantListService } from '@applications/shared/services';
import { AppState } from '@core/store/reducers';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RoleEnum, SprintRoleEnum, RoleCategoryEnum } from '@core/modules/roles/enums';
import * as fromRoles from '@core/modules/roles/store/roles.reducer';
import { RolesInterface } from '@core/modules/roles/interfaces/roles.interface';

import { Team } from '../../../models/team.model';
import * as UsersActions from '../../../store/action/user.action';


export interface CollaboratorDialogFormComponentData {
  projectPk: number;
  member: ProjectMember;
  title: string;
  rolesForMember: Array<SprintRoleEnum>;
  teamsForMember: Array<number>;
  showFullScreen?: boolean;
}

@Component({
  templateUrl: './collaborator-dialog-form.component.html',
  styleUrls: ['./collaborator-dialog-form.component.scss']
})
export class CollaboratorDialogFormComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  filteredConsultant: Observable<ConsultantModel[]>;
  rolesList: {role: RolesInterface, isDisabled: boolean}[] = [];
  allRoles: RolesInterface[] = [];
  allTeams: Team[] = [];

  form = this.fb.group({
    roles: ['', Validators.required],
    consultant: ['', Validators.required],
    teams: ['']
  });

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: CollaboratorDialogFormComponentData,
    @Optional() @Inject(DATA) public data: CollaboratorDialogFormComponentData,
    @Optional() private overlayRef: OverlayReference,
    @Optional() private dialogRef: MatDialogRef<CollaboratorDialogFormComponent>,
    private fb: FormBuilder,
    private consultantsService: ConsultantListService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.data = this.data ? this.data : this.dialogData;
    this.subscription.add(
      combineLatest(
        [
          this.store.pipe(select(state => fromRoles.getRolesByCategory(state.roles, RoleCategoryEnum.enums.SPRINT))),
          this.store.pipe(select(state => fromStore.selectAllTeams(state.workspaceProjects)))
        ]
      ).pipe(
        map(([roles, teams]: [RolesInterface[], Team[]]) => {
          this.allRoles = roles.filter(
            r => r.code !== RoleEnum.enums.SPRINT_PARTICIPANT_SPRINT
          );
          this.allTeams = teams;
          this.buildAvailableRoles();
          if (this.data.member) {
            this.loadCollaboratorData();
          }
        })).subscribe()
    );

    this.filteredConsultant = this.form.get('consultant').valueChanges.pipe(
      debounceTime(300),
      map(user =>  user && typeof user === 'object' ? user.name : user),
      flatMap(name => name ? this.consultantsService.getConsultants(name) : [])
    );
    this.subscription.add(this.form.get('consultant').valueChanges.pipe(pairwise()).subscribe(
      ([prevValue, nextValue]: [any, any]) => {
        if (nextValue instanceof ConsultantModel || nextValue === '') {
          this.buildAvailableRoles();
          if (prevValue) {
            this.form.get('roles').setValue('');
          }
        }
      }
    ));

    this.subscription.add(this.form.get('roles').valueChanges.subscribe(
      values => values ? this.manageTeamselector(values) :  this.form.get('teams').disable()
    ));
  }

  loadCollaboratorData() {
    // I need the associated consultant because the user doesn't have
    // the information about the certifications. To find the consultant is better do it by email.
    this.subscription.add(
      this.consultantsService.getConsultants(this.data.member.user.email).subscribe(
        consultants => this.form.get('consultant').setValue(consultants[0])
      )
    );
    this.form.get('consultant').disable();
    const selectedRoles = [];
    if (this.data.rolesForMember.length > 0) {
      this.data.rolesForMember.map(code =>
        selectedRoles.push(this.allRoles.find(r => r.code === code))
      );
      this.form.get('roles').setValue(selectedRoles);
    }
    if (this.data.teamsForMember.length > 0) {
      const selectedTeams = [];
      this.data.teamsForMember.map(teamPk => {
        selectedTeams.push(this.allTeams.find(t => t.pk === teamPk));
      });
      if (selectedTeams.length > 0) {
        this.form.get('teams').setValue(selectedTeams);
      }
    }
  }

  buildAvailableRoles() {
    this.rolesList = this.allRoles.map(r => ({role: r, isDisabled: this.deactivateRole(r)}));
  }

  deactivateRole (role: RolesInterface): boolean {
    // TODO: this logic should be sent by the backend
    const consultant = this.form.get('consultant').value;
    if (consultant) {
      switch (true) {
        case (role.code === SprintRoleEnum.HEAD_COACH_SPRINT):
        case (role.code === SprintRoleEnum.SPRINT_COACH_SPRINT):
          return !consultant.isCertifiedInCode(CertificationEnum.SPRINT_COACH);
        case (role.code === SprintRoleEnum.ALIGN_TRAINER_SPRINT):
          return !consultant.isCertifiedInCode(CertificationEnum.TRAINER);
        case (role.code === SprintRoleEnum.AWAKE_SPEAKER_SPRINT):
          return !consultant.isCertifiedInCode(CertificationEnum.CONSULTANT);
        case (role.code === SprintRoleEnum.ADVISOR_SPRINT):
        case (role.code === SprintRoleEnum.DISRUPTOR_SPRINT):
        case (role.code === SprintRoleEnum.DISRUPTOR_SPEAKER_SPRINT):
          return !consultant.isCertifiedInCode(CertificationEnum.FOUNDATION);
      }
    }
    return false;
  }

  manageTeamselector(values: RolesInterface[]) {
    if (values.some(r => r.code === SprintRoleEnum.SPRINT_COACH_SPRINT)) {
      this.form.get('teams').enable();
    } else {
      this.form.get('teams').disable();
    }
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const payload = {
        data: {
          projectRoles: this.form.get('roles').value.map(r => r.code),
          teams: this.form.get('teams').value ?
            this.form.get('teams').value.map(t => t.pk) :
            [],
          user: this.form.get('consultant').value.uuid
        },
        projectPk: this.data.projectPk
      };

      if (this.data.member) {
        const payloadToEdit = {...payload, ...{userUuid: this.form.get('consultant').value.uuid}};
        this.store.dispatch(new UsersActions.EditCollaborator(payloadToEdit));
      } else {
        this.store.dispatch(new UsersActions.CreateCollaborator(payload));
      }
      this.onClose();
    }
  }

  onClose() {
    this.dialogRef ? this.dialogRef.close() : this.overlayRef.close();
  }

  displayFn(consultant: ConsultantModel): string {
    return consultant ? consultant.fullName : '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
