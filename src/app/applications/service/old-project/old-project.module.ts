import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ProjectsEffects } from './store/project/projects.effects';
import { TeamResolver } from './resolvers/team.resolver';
import { StepEffects } from './store/steps/step.effect';
import { TeamsEffect } from './store/teams/team.effect';
import { reducers } from './store/reducers';
import { DelivarableEffects } from '../shared/deliverable.effects';
import { OldProjectRoutingModule } from './old-project-routing.module';
import {
  ServiceContainerComponent,
  AssignmentContainerComponent,
  AssignmentLearnContainerComponent,
  AssignmentDeliverContainerComponent,
  AssignmentReflectContainerComponent,
  TaskPageContainerComponent
} from './container';

import {
  DeserializerProjectService,
  ProjectService,
  ProjectWebsocketService,
  ServiceInformationService,
  StepService,
  TeamService
} from './services';

import { ProjectResolver } from './resolvers/project.resolver';
import { DirectoryGuard } from './directory.guard';
import { DirectoryModule } from './modules/directory/directory.module';

@NgModule({
  imports: [
    OldProjectRoutingModule,
    DirectoryModule, // Import/Export SharedServiceModule
    StoreModule.forFeature('service', reducers),
    EffectsModule.forFeature([ProjectsEffects, StepEffects, TeamsEffect, DelivarableEffects])
  ],
  providers: [
    TeamResolver,
    DeserializerProjectService,
    ProjectResolver,
    ProjectService,
    ProjectWebsocketService,
    ServiceInformationService,
    StepService,
    TeamService,
    DirectoryGuard
  ],
  declarations: [
    ServiceContainerComponent,
    AssignmentContainerComponent,
    AssignmentLearnContainerComponent,
    AssignmentDeliverContainerComponent,
    AssignmentReflectContainerComponent,
    TaskPageContainerComponent,
  ]
})
export class OldProjectModule { }
