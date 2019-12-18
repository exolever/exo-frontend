import { Component, OnInit, Inject, Optional, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import * as fromStore from '@applications/workspace/projects/store/reducer';
import * as TeamActions from '@applications/workspace/projects/store/action/team.action';
import { DATA } from '@core/modules/overlay/services/overlay.service';
import { OverlayReference } from '@overlay/overlay-ref';
import { Team } from '@applications/workspace/projects/models/team.model';
import { GenericProject } from '@applications/workspace/projects/models/project.model';

import { ProjectService } from '@applications/workspace/projects/services/project.service';
import { RolesInterface } from '@core/modules/roles/interfaces/roles.interface';

@Component({
  templateUrl: './users-selection-dialog.component.html',
  styleUrls: ['./users-selection-dialog.component.scss']
})
export class UserSelectionDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private subscriptions = new Subscription();
  teams$: Observable<Team[]>;
  roles: RolesInterface[] = [];
  data$: Subject<any> = new Subject();
  @ViewChild('usersList', {static: false}) usersUnassigned: MatSelectionList;
  users;

  constructor(
    @Optional() @Inject(DATA) public data:
      { team: Team, showFullScreen: boolean, title?: string, projectPk: number },
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData:
      { team: Team, showFullScreen: boolean, title?: string, projectPk: number },
    @Optional() private dialogRef: MatDialogRef<UserSelectionDialogComponent>,
    @Optional() private overlayRef: OverlayReference,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private projectService: ProjectService
  ) {
    if (this.dialogData) {
      this.data = this.dialogData;
    }
  }

  ngOnInit() {
    this.form = this.fb.group ({
      'team': [{value: this.data.team ? this.data.team.pk : undefined, disabled: true}, Validators.required],
      'search': [undefined]
    });

    this.subscriptions.add(
      this.form.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((values) => {
        let info = this.users;
        if (values.search) {
          info = info.filter(user => {
            if (user.user.fullName && user.user.fullName.includes(values.search)) {
              return true;
            } else if (user.user.shortName && user.user.shortName.includes(values.search)) {
              return true;
            } else {
              return user.user.name && user.user.name.includes(values.search);
            }
          });
        }
        this.data$.next(info);
      })
    );

    this.teams$ = this.store.pipe(select(state => fromStore.selectAllTeams(state.workspaceProjects)));

    this.subscriptions.add(
      this.store.pipe(
        select(state => fromStore.selectProjectSelected(state.workspaceProjects.projects)),
        tap((project: GenericProject) => this.roles = project.teamRoles)
      ).subscribe()
    );

    this.subscriptions.add(
      this.projectService.getUnassignedUsers(this.data.projectPk).subscribe(data => {
        this.users = data;
        this.data$.next(this.users);
      })
    );
  }

  showRolName(roles: number[]): string {
    const rolesFound = this.roles.filter(obj => roles.includes(obj.code));
    return rolesFound ? rolesFound.map(obj => obj.name).join(', ') : undefined;
  }

  onSave() {
    const data = this.usersUnassigned.selectedOptions.selected.map(item => item.value);
    this.store.dispatch(
      new TeamActions.SelectPeople({
        projectPk: this.data.projectPk,
        teamPk: this.data.team.pk,
        data: data
      })
    );
    this.closeOverlay();
  }

  closeOverlay() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.overlayRef.close();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
