import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ApplicationsSharedModule } from '@applications/shared/applications-shared.module';

import { PublicRoutingModule } from './public-routing.module';
import { RequestPasswordComponent } from './components/password/request/request.component';
import { ChangePasswordComponent } from './components/password/change/change.component';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';
import { PublicComponent } from './public.component';
import { SignupComponent } from './components/signup/signup.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PasswordRecoverService } from './components/password/services/password-recover.service';
import { SignupService } from './services/signup.service';
import { PublicAreaConfigProvider } from './public-area.config';


@NgModule({
  imports: [
    SharedModule,
    ApplicationsSharedModule,
    PublicRoutingModule,
  ],
  declarations: [
    ChangePasswordComponent,
    LoginComponent,
    PublicComponent,
    RequestPasswordComponent,
    SignupComponent,
    LogoutComponent
  ],
  providers: [
    PasswordRecoverService,
    SignupService,
    PublicAreaConfigProvider,
    LoginService
  ]
})

export class PublicModule {}
