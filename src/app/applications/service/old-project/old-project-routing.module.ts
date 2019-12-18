import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { URL_TEAM_COMMUNICATION } from '@applications/service/shared/service.conf';
import { DirectoryGuard } from '@applications/service/old-project/directory.guard';

import { ProjectResolver } from './resolvers/project.resolver';
import {
  MediaComponent
} from '../shared/components';
import {
  ServiceContainerComponent,
  AssignmentContainerComponent,
  AssignmentLearnContainerComponent,
  AssignmentDeliverContainerComponent,
  AssignmentReflectContainerComponent,
  TaskPageContainerComponent,
} from './container';
import { TeamResolver } from './resolvers/team.resolver';
import { DirectoryComponent } from './modules/directory/container/directory/directory.component';

const routesService: Routes = [
  { path: ':pkService/team/:pkTeam', component: ServiceContainerComponent, resolve: { project: ProjectResolver },
    children: [
      {
        path: 'step/:pk',
        component: AssignmentContainerComponent,
        children: [
          { path: 'learn', component: AssignmentLearnContainerComponent },
          { path: 'deliver', component: AssignmentDeliverContainerComponent },
          { path: 'reflect', component: AssignmentReflectContainerComponent },
          { path: 'task/:pkTask', component: TaskPageContainerComponent }
        ]
      },
      { path: 'media', component: MediaComponent },
      { path: 'members', component: DirectoryComponent, canActivate: [DirectoryGuard]},
      {
        path: 'requests',
        resolve: { teamSelected: TeamResolver },
        loadChildren: () =>
          import('../shared/modules/advisory-call/advisory-call.module')
            .then(m => m.AdvisoryCallModule)
      },
      { path: 'ask-ecosystem',
        resolve: { teamSelected: TeamResolver },
        loadChildren: () =>
          import('../../ask-to-ecosystem/ask-to-ecosystem.module').then(m => m.AskToEcosystemModule) },
      {
        path: URL_TEAM_COMMUNICATION,
        resolve: { teamSelected: TeamResolver },
        loadChildren: () =>
          import('../shared/modules/team-communication/team-communication.module').then(m => m.TeamCommunicationModule)
      },
      { path: 'swarm-session', loadChildren: () =>
          import('../shared/modules/swarm-sessions/swarm-sessions.module').then(m => m.SwarmSessionsModule) },
      { path: 'profile', loadChildren: () =>
        import('../../profile/profile.module').then(m => m.ProfileModule) },
      {
        path: 'profile/:slug/edit',
        loadChildren: () =>
          import('../../profile-edition/profile-edition.module').then(m => m.ProfileEditionModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routesService)],
  exports: [RouterModule]
})
export class OldProjectRoutingModule { }
