import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedUserResolver } from '../routing/resolvers/logged-user.resolver';
import { UserGuard } from '../routing/guards/user.guard';
import { ApplicationsComponent } from './applications.component';

const routesApplications: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    children: [
      {
        path: 'ecosystem',
        loadChildren: () => import('./ecosystem/ecosystem.module').then(m => m.EcosystemModule),
        resolve: { loggedUser: LoggedUserResolver },
        canActivate: [UserGuard],
        canActivateChild: [UserGuard],
      },
      {
        path: 'platform/service/exo',
        loadChildren: () => import('./service/generic-project/generic-project.module').then(m => m.GProjectModule),
        resolve: { loggedUser: LoggedUserResolver },
        canActivate: [UserGuard],
        canActivateChild: [UserGuard]
      },
      {
        path: 'platform/service',
        loadChildren: () => import('./service/old-project/old-project.module').then(m => m.OldProjectModule),
        resolve: { loggedUser: LoggedUserResolver },
        canActivate: [UserGuard],
        canActivateChild: [UserGuard]
      },
      {
        path: 'signup',
        loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule),
        resolve: { loggedUser: LoggedUserResolver },
        canActivate: [UserGuard]
      },
      {
        path: 'invitations',
        loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule),
        resolve: { loggedUser: LoggedUserResolver }
      },
      {
        path: 'advisor-request/view/:pk',
        redirectTo: 'ecosystem/opportunities/:pk/chat',
        resolve: { loggedUser: LoggedUserResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesApplications)],
  exports: [RouterModule],
  providers: [LoggedUserResolver, UserGuard]
})
export class ApplicationsRoutingModule { }
