import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@applications/loaders/loader.module';
import { ExOAvatarSystemModule } from '@openexo/design-system';
import { CertificatesModule } from '@applications/certificates/certificates.module';

import { SharedServiceModule } from '../../../shared/shared-service.module';
import { DirectoryComponent } from './container/directory/directory.component';
import { MembersByRole, MembersByTeam } from './pipes/filterTeam.pipe';
import { TeamService, DeserializeTeamService } from './services';


@NgModule({
  imports: [
    SharedModule,
    SharedServiceModule,
    RouterModule,
    MatGridListModule,
    CertificatesModule,
    LoaderModule,
    ExOAvatarSystemModule

  ],
  providers: [
    TeamService,
    DeserializeTeamService
  ],
  declarations: [
    DirectoryComponent,
    MembersByRole,
    MembersByTeam
  ],
  exports: [
    DirectoryComponent,
    SharedServiceModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DirectoryModule { }
