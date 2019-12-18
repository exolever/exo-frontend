import { NgModule } from '@angular/core';

import { UiConfigProvider } from '@core/config/ui-config';
import { ExoCommonModule } from '@shared/exo-common.module';
import { FilestackService } from '@core/services/filestack.service';

import { SessionTimerComponent } from './components/session-timer/session-timer.component';
import { RefreshAnnounceComponent } from './components/refresh-announce/refresh-announce.component';
import { SessionStatusService } from './services/session-status.service';
import { SwarmPromptService } from './services/swarm-prompt.service';

@NgModule({
  imports: [
    ExoCommonModule
  ],
  providers: [
    SessionStatusService,
    SwarmPromptService,
    UiConfigProvider,
    FilestackService
  ],
  declarations: [
    SessionTimerComponent,
    RefreshAnnounceComponent
  ],
  exports: [
    SessionTimerComponent,
    RefreshAnnounceComponent
  ],
  entryComponents: []
})
export class SwarmSessionsSharedModule { }
