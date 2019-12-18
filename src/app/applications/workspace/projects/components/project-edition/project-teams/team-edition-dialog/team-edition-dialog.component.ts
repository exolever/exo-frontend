import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { DATA } from '@core/modules/overlay/services/overlay.service';
import * as TeamActions from '@applications/workspace/projects/store/action/team.action';
import { OverlayReference } from '@overlay/overlay-ref';
import { Team } from '@applications/workspace/projects/models/team.model';
import * as fromStore from '@applications/workspace/projects/store/reducer/index';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { map } from 'rxjs/operators';
import { StreamInterface } from '@applications/workspace/projects/models/project.interface';


@Component({
  templateUrl: './team-edition-dialog.component.html',
  styleUrls: ['./team-edition-dialog.component.scss']
})
export class TeamEditionDialogComponent implements OnInit {
  form: FormGroup;
  streams$: Observable<StreamInterface[]>;

  constructor(
    @Optional() @Inject(DATA) public data:
      { team: Team, showFullScreen: boolean, title?: string, projectPk: number },
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData:
      { team: Team, showFullScreen: boolean, title?: string, projectPk: number },
    @Optional() private dialogRef: MatDialogRef<TeamEditionDialogComponent>,
    @Optional() private overlayRef: OverlayReference,
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) {
    if (this.dialogData) {
      this.data = this.dialogData;
    }
  }

  ngOnInit() {
    this.streams$ = this.store.pipe(
      select(state => fromStore.selectProjectSelected(state.workspaceProjects.projects)),
      map((project: GenericProject) => project.streams)
    );
    this.form = this.fb.group ({
      'name': [this.data.team ? this.data.team.name : undefined, Validators.required],
      'stream': [this.data.team ? this.data.team.stream : undefined, Validators.required]
    });
  }

  equalStreams(s1, s2) {
    return s1 && s2 && s1.pk === s2.pk;
  }

  onSave() {
    if (this.form.valid) {
      const newTeam = new Team({...this.data.team, ...this.form.getRawValue()});
      const action = newTeam.pk ?
        new TeamActions.Edit({team: newTeam, projectPk: this.data.projectPk}) :
        new TeamActions.Create({team: newTeam, projectPk: this.data.projectPk});
      this.store.dispatch(action);
      this.closeOverlay();
    }
  }

  closeOverlay() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.overlayRef.close();
    }
  }

}
