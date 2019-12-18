import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './components/password/change/change.component';
import { LoginComponent } from './components/login/login.component';
import { PublicComponent } from './public.component';
import { RequestPasswordComponent } from './components/password/request/request.component';
import { SignupComponent } from './components/signup/signup.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RedirectToGuard } from '@routing/guards/redirect-to.guard';

const publicRoutes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      { path: 'auth/go-to', canActivate: [RedirectToGuard]},
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/login/', component: LoginComponent },
      { path: 'auth/logout', component: LogoutComponent },
      { path: 'auth/signup/:hash', component: SignupComponent },
      { path: 'auth/signup/:hash/', component: SignupComponent },
      { path: 'auth/password', component: RequestPasswordComponent },
      { path: 'password/reset/:token/:mail', component: ChangePasswordComponent },
      {
        path: 'public/profile',
        loadChildren: () => import('../applications/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(publicRoutes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
