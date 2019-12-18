import { NgModule } from '@angular/core';
import { MatCardModule, MatTableModule, MatListModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { ProfileSharedModule } from '@profile-edition/shared/profile-shared.module';
import { BreakPointModule } from '@applications/break-point/break-point.module';
import { OverlayModule } from '@overlay/overlay.module';
import {
  OpportunitiesFieldsSharedModule
} from '@shared/modules/opportunities-fields-shared/opportunities-fields-shared.module';

import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectsListComponent } from './components/project-list/projects-list.component';
import { GeneralFormComponent } from './components/shared/general-form/general-form.component';
import { ContainerComponent } from './components/project-edition/container/container.component';
import {
  ProjectSideNavigationComponent
} from './components/project-edition/project-side-navigation/project-side-navigation.component';
import {
  ProjectGeneralInformationComponent
} from './components/project-edition/project-general-information/project-general-information.component';
import { ProjectTeamsComponent } from './components/project-edition/project-teams/project-teams.component';
import { ProjectSettingsComponent } from './components/project-edition/project-settings/project-settings.component';
import { ProjectEditionGuard } from './edit-project.guard';
import { ProjectStepsComponent } from './components/project-edition/project-steps/project-steps.component';

import {
  StepEditionDialogComponent
} from './components/project-edition/project-steps/step-edition-dialog/step-edition-dialog.component';
import {
  CollaboratorDialogFormComponent
// tslint:disable-next-line:max-line-length
} from './components/shared/collaborator-dialog-form/collaborator-dialog-form.component';
import {
  ParticipantDialogFormComponent
// tslint:disable-next-line:max-line-length
} from './components/shared/participant-dialog-form/participant-dialog-form.component';
import {
  TeamEditionDialogComponent
} from './components/project-edition/project-teams/team-edition-dialog/team-edition-dialog.component';

import { ProjectsEffect } from './store/effect/projects.effect';
import { StepsEffect } from './store/effect/steps.effect';
import { TeamsEffect } from './store/effect/teams.effect';
import { UsersEffect } from './store/effect/users.effect';
import { ProjectService } from './services/project.service';
import { reducers } from './store/reducer';
import { StepService } from './services/step.service';
import { TeamService } from './services/team.service';
import { UserService } from './services/user.service';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectMembersComponent } from './components/project-edition/project-members/project-members.component';
import {
  UserSelectionDialogComponent
} from './components/project-edition/project-teams/users-selection-dialog/users-selection-dialog.component';
import { ProjectStatusLabelComponent } from './components/shared/project-status-label/project-status-label.component';
// tslint:disable-next-line:max-line-length
import {
  UploadedParticipantsDialogComponent
// tslint:disable-next-line: max-line-length
} from './components/shared/participant-dialog-form/uploaded-participants-dialog/uploaded-participants-dialog.component';
import { ProjectProfileComponent } from './components/project-profile/project-profile.component';
import {
  AdvisoryCallSettingsDialogComponent
  // tslint:disable-next-line: max-line-length
} from './components/project-edition/project-settings/advisory-call-settings-dialog/advisory-call-settings-dialog.component';

@NgModule({
  imports: [
    ProfileSharedModule,
    CustomMd2DatepickerModule,
    ProjectsRoutingModule,
    SharedModule,
    MatCardModule,
    MatListModule,
    LoaderModule,
    MatTableModule,
    BreakPointModule,
    OverlayModule,
    OpportunitiesFieldsSharedModule,
    StoreModule.forFeature('workspaceProjects', reducers),
    EffectsModule.forFeature([ProjectsEffect, StepsEffect, TeamsEffect, UsersEffect]),
  ],
  declarations: [
    ProjectCreateComponent,
    ProjectsListComponent,
    GeneralFormComponent,
    ContainerComponent,
    ProjectSideNavigationComponent,
    ProjectGeneralInformationComponent,
    ProjectTeamsComponent,
    ProjectSettingsComponent,
    ProjectStepsComponent,
    StepEditionDialogComponent,
    CollaboratorDialogFormComponent,
    ParticipantDialogFormComponent,
    TeamEditionDialogComponent,
    ProjectMembersComponent,
    UserSelectionDialogComponent,
    ProjectStatusLabelComponent,
    UploadedParticipantsDialogComponent,
    ProjectProfileComponent,
    AdvisoryCallSettingsDialogComponent
  ],
  providers: [
    ProjectEditionGuard,
    ProjectService,
    StepService,
    TeamService,
    UserService
  ],
  entryComponents: [
    StepEditionDialogComponent,
    CollaboratorDialogFormComponent,
    ParticipantDialogFormComponent,
    UploadedParticipantsDialogComponent,
    TeamEditionDialogComponent,
    UserSelectionDialogComponent,
    AdvisoryCallSettingsDialogComponent
  ],
  exports: [
    ProjectProfileComponent
  ],
  schemas: []
})
export class ProjectsModule { }
