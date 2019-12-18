import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { URL_TEAM_COMMUNICATION } from '@service/shared/service.conf';
import { MediaComponent } from '@service/shared/components';

import { GenericProjectResolver } from './resolvers/generic-project.resolver';
import { TeamResolver } from './resolvers/team.resolver';
import {
  GenericServiceContainerComponent,
  AssignmentContainerComponent,
  AssignmentDeliverContainerComponent,
  AssignmentLearnContainerComponent,
  AssignmentReflectContainerComponent,
  TaskPageContainerComponent
} from './container';
import { DirectoryComponent } from './container/directory/directory.component';
import { DirectoryGuard } from './directory.guard';

const routesService: Routes = [
  {
    path: ':pkService/team/:pkTeam',
    component: GenericServiceContainerComponent,
    resolve: { project: GenericProjectResolver, teamSelected: TeamResolver},
    children: [
      {
        path: 'step/:pk',
        component: AssignmentContainerComponent,
        children: [
          { path: 'learn', component: AssignmentLearnContainerComponent, },
          { path: 'deliver', component: AssignmentDeliverContainerComponent },
          { path: 'reflect', component: AssignmentReflectContainerComponent },
          { path: 'task/:pkTask', component: TaskPageContainerComponent }
        ]
      },
      { path: 'media', component: MediaComponent },
      { path: 'members', component: DirectoryComponent, canActivate: [DirectoryGuard]},
      {
        path: URL_TEAM_COMMUNICATION,
        resolve: { teamSelected: TeamResolver },
        loadChildren: () =>
          import('../shared/modules/team-communication/team-communication.module')
            .then(m => m.TeamCommunicationModule)
      },
      {
        path: 'requests',
        resolve: { teamSelected: TeamResolver },
        loadChildren: () =>
          import('../shared/modules/advisory-call/advisory-call.module')
            .then(m => m.AdvisoryCallModule)
      },
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
export class GenericProjectRoutingModule { }
