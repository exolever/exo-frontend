import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';

import { ExOAvatarSystemModule, ExOAvatarModule } from '@openexo/design-system';

import { ExoCommonModule } from '@shared/exo-common.module';
import { PipeModule } from '@shared/pipes/pipes.module';
import { DirectivesModule } from '@shared/directives/directives.module';

import { MemberCardComponent } from './member-card.component';


@NgModule({
  imports: [
    ExoCommonModule,
    PipeModule,
    DirectivesModule,
    MatTooltipModule,
    ExOAvatarSystemModule,
    ExOAvatarModule,
  ],
  declarations: [
    MemberCardComponent,
  ],
  exports: [
    MemberCardComponent
  ]
})
export class MemberCardModule { }
