import { NgModule } from '@angular/core';

// External libraries
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Modules
import { SharedServiceModule } from '@service/shared/shared-service.module';

// Services
import { StepsService } from './services/steps.service';
import { GenericProjectService } from './services/generic-project.service';
import { TeamsService } from './services/teams.service';
import { MembersService } from './services/members.service';
import { GenericProjectWebsocketService } from './services/generic-project-websocket.service';
import { DirectoryGuard } from './directory.guard';

// Store
import { GenericProjectEffects } from './store/effects/generic-project.effects';
import { StepEffects } from './store/effects/steps.effects';
import { reducers } from './store/reducer';
import { MembersEffect } from './store/effects/members.effect';
import { DelivarableEffects } from '../shared/deliverable.effects';
// Routes
import { GenericProjectRoutingModule } from './generic-project-routing.module';

// Components
import {
  GenericServiceContainerComponent,
  AssignmentContainerComponent,
  AssignmentDeliverContainerComponent,
  AssignmentLearnContainerComponent,
  AssignmentReflectContainerComponent,
  TaskPageContainerComponent
} from './container';
import { DirectoryComponent } from './container/directory/directory.component';

// Resolvers
import { TeamResolver } from './resolvers/team.resolver';
import { GenericProjectResolver } from './resolvers/generic-project.resolver';

@NgModule({
  imports: [
    SharedServiceModule,
    GenericProjectRoutingModule,
    StoreModule.forFeature('genericProject', reducers),
    EffectsModule.forFeature([
      GenericProjectEffects,
      StepEffects,
      MembersEffect,
      DelivarableEffects,
    ])
  ],
  providers: [
    GenericProjectWebsocketService,
    GenericProjectService,
    StepsService,
    TeamsService,
    TeamResolver,
    GenericProjectResolver,
    MembersService,
    DirectoryGuard
  ],
  declarations: [
    GenericServiceContainerComponent,
    AssignmentContainerComponent,
    AssignmentDeliverContainerComponent,
    AssignmentLearnContainerComponent,
    AssignmentReflectContainerComponent,
    TaskPageContainerComponent,
    DirectoryComponent
  ]
})
export class GProjectModule { }
