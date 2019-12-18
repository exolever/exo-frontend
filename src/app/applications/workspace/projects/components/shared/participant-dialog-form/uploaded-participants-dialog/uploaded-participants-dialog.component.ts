import { Component, OnInit, Inject, Optional, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { VALIDATION_CONFIG } from '@core/config/validation-config';
import { DATA } from '@core/modules/overlay/services/overlay.service';
import { OverlayReference } from '@overlay/overlay-ref';
import { AppState } from '@core/store/reducers';

import { UserService } from '../../../../services/user.service';
import { Team } from '../../../../models/team.model';
import * as UsersActions from '../../../../store/action/user.action';

interface UploadedParticipantsDialogComponentData {
  participantsList: {name: string, email: string}[];
  showFullScreen: string;
  projectPk: number;
  teams: Team[];
}
@Component({
  selector: 'app-uploaded-participants-dialog',
  templateUrl: './uploaded-participants-dialog.component.html',
  styleUrls: ['./uploaded-participants-dialog.component.scss']
})
export class UploadedParticipantsDialogComponent implements OnInit, OnDestroy {
  title: string;
  subscription = new Subscription();

  constructor(
    @Inject(VALIDATION_CONFIG) public validationConfig,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: UploadedParticipantsDialogComponentData,
    @Optional() @Inject(DATA) public data: UploadedParticipantsDialogComponentData,
    @Optional() private overlayRef: OverlayReference,
    @Optional() private dialogRef: MatDialogRef<UploadedParticipantsDialogComponent>,
    private userService: UserService,
    private translate: TranslateService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.data = this.data ? this.data : this.dialogData;
    this.title = this.setTitle();
  }

  onClose() {
    this.dialogRef ? this.dialogRef.close() : this.overlayRef.close();
  }

  onContinue() {
    const dataToSend = {
      teams: this.data.teams.map((t: Team) => t.pk),
      users: this.data.participantsList
    };
    this.subscription.add(
      this.userService.uploadParticipantsInBulk(this.data.projectPk, dataToSend).subscribe(
        () => {
          this.onClose();
          this.store.dispatch(new UsersActions.Load(this.data.projectPk));
        }
      )
    );
  }

  setTitle(): string {
    const numberSelectedTeams = this.data.teams.length;
    let title;
    switch (numberSelectedTeams) {
      case 0:
        title = this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.UPLOAD_PARTICIPANTS.INFO.NO_TEAMS');
        break;
      case 1:
        title = `
        ${this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.UPLOAD_PARTICIPANTS.INFO.ONE_TEAM')}
        ${this.data.teams[0].name}
        `;
        break;
      default:
        title = `
          ${this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.UPLOAD_PARTICIPANTS.INFO.SEVERAL_TEAMS')}
          ${this.data.teams.map((t: Team) => t.name).join(', ')}
        `;
    }
    return title;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
