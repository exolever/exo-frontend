import { Component, Inject, Optional, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PickerResponse } from 'filestack-js/build/main/lib/picker';

import { VALIDATION_CONFIG } from '@core/config/validation-config';
import { OverlayReference } from '@overlay/overlay-ref';
import { DATA } from '@overlay/services/overlay.service';
import { FilestackService } from '@core/services/filestack.service';
import { AppState } from '@core/store/reducers';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';
import { BreakPointService } from '@applications/break-point/break-point.service';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { TranslateService } from '@ngx-translate/core';

import { Team } from '../../../models/team.model';
import * as UsersActions from '../../../store/action/user.action';
import { UserService } from '../../../services/user.service';
import {
  UploadedParticipantsDialogComponent
} from './uploaded-participants-dialog/uploaded-participants-dialog.component';

export interface ParticipantDialogFormComponentData {
  projectPk: number;
  member: ProjectMember;
  title: string;
  teamsForMember: Array<number>;
  showFullScreen?: boolean;
}

@Component({
  templateUrl: './participant-dialog-form.component.html',
  styleUrls: ['./participant-dialog-form.component.scss']
})
export class ParticipantDialogFormComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.validationConfig.maxLength)]],
    email: ['', [Validators.required, Validators.email]],
    teams: ['']
  });
  picker;
  allTeams: Team[] = [];
  subscription = new Subscription();
  participantListBulkUploaded: {name: string, email: string}[];
  fileExample = '/assets/workspace/projects/example-upload-participants-template.csv';
  constructor(
    @Inject(VALIDATION_CONFIG) public validationConfig,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: ParticipantDialogFormComponentData,
    @Optional() @Inject(DATA) public data: ParticipantDialogFormComponentData,
    @Optional() private overlayRef: OverlayReference,
    @Optional() private dialogRef: MatDialogRef<ParticipantDialogFormComponent>,
    private fb: FormBuilder,
    public filestack: FilestackService,
    private store: Store<AppState>,
    private userService: UserService,
    private breakPointService: BreakPointService,
    private promptDialogService: PromptDialogService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.data = this.data ? this.data : this.dialogData;
    this.filestack.init();
    this.subscription.add(
      this.store.pipe(select(state => fromStore.selectAllTeams(state.workspaceProjects))).pipe(
        map((teams: Team[]) => {
          this.allTeams = teams;
          if (this.data.member) {
            this.loadParticipant();
          }
        })).subscribe()
    );
  }

  loadParticipant() {
    if (this.data.member.canEditUserDataForParticipants()) {
      this.form.get('name').setValue(this.data.member.user.shortName);
      this.form.get('email').setValue(this.data.member.user.email);
    } else { // Only can edit teams field
      this.form.removeControl('name');
      this.form.removeControl('email');
    }
    const selectedTeams = [];
    this.data.teamsForMember.map(teamPk =>
      selectedTeams.push(this.allTeams.find(t => t.pk === teamPk))
    );
    if (selectedTeams.length > 0) {
      this.form.get('teams').setValue(selectedTeams);
    }
  }

  onClose() {
    this.dialogRef ? this.dialogRef.close() : this.overlayRef.close();
  }

  onClickUploadFile() {
    this.onClose();
    this.picker = this.filestack.open({
      onUploadDone: (res: PickerResponse) => {
        res.filesUploaded.forEach(file => {
          this.userService.parseParticipantsFile(this.data.projectPk, file.handle).subscribe(
            data => {
              this.participantListBulkUploaded = data;
              this.showUploadedParticipants();
            },
            () => this.showErrorParticipantsUploadedBulk()
          );
        });
        this.picker.close();
      }
    });
  }

  showUploadedParticipants() {
    this.subscription.add(this.breakPointService.fsSmDialogLg(UploadedParticipantsDialogComponent, {
      participantsList: this.participantListBulkUploaded,
      projectPk: this.data.projectPk,
      teams: this.form.get('teams').value ? this.form.get('teams').value : []
    }).subscribe());
  }

  showErrorParticipantsUploadedBulk() {
    this.subscription.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.UPLOAD_PARTICIPANTS.ERROR.TITLE'),
        messages: [
          this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.UPLOAD_PARTICIPANTS.ERROR.DESCRIPTION')
        ],
        extraHTML: [
          `<a href="${this.fileExample}" target="_blank">
            ${this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.UPLOAD_PARTICIPANTS.ERROR.EXAMPLE')}
          </a>`
        ],
        secondaryButton: this.translate.instant('COMMON.ACTIONS.CANCEL'),
        primaryButton: this.translate.instant('COMMON.ACTIONS.CONTINUE')
      }).pipe(
        filter((result) => result === true)
      ).subscribe(() => this.onClickUploadFile())
    );
  }

  buildDataToCreateParticipant() {
    return {
      data: {
        name: this.form.get('name').value,
        email: this.form.get('email').value,
        teams: this.form.get('teams').value ?
          this.form.get('teams').value.map(t => t.pk) :
          [],
      },
      projectPk: this.data.projectPk
    };
  }

  buildDataToEditParticipant() {
    return {...this.buildDataToCreateParticipant(), ...{userUuid: this.data.member.user.uuid}};
  }

  buildDataToEditParticipantTeams() {
    return {
      data: {
        teams: this.form.get('teams').value ?
          this.form.get('teams').value.map(t => t.pk) :
          [],
      },
      projectPk: this.data.projectPk,
      userUuid: this.data.member.user.uuid
    };
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.data.member) {
        this.data.member.canEditUserDataForParticipants() ?
          this.store.dispatch(new UsersActions.EditParticipant(this.buildDataToEditParticipant())) :
          this.store.dispatch(new UsersActions.EditParticipantTeams(this.buildDataToEditParticipantTeams()));
      } else {
        this.store.dispatch(new UsersActions.CreateParticipant(this.buildDataToCreateParticipant()));
      }
      this.onClose();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
