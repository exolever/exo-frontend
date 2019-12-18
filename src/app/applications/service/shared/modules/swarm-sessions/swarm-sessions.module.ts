import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { ForumModule } from '@applications/forum/forum.module';
import { LoaderModule } from '@loaders/loader.module';
import { SwarmSessionsSharedModule } from '@applications/swarm-sessions/sharedModule/swarm-sessions-shared.module';
import { UiConfigProvider } from '@core/config/ui-config';

import { SwarmSessionsRoutingModule } from './swarm-sessions-routing.module';
import { SwarmSessionsService } from './services/swarm-sessions.service';
import { reducers } from './store/reducer/index';
import { AnswersEffect } from './store/effect/answers.effect';
import { QuestionsEffect } from './store/effect/questions.effect';
import { SessionsEffect } from './store/effect/sessions.effect';

import { SwarmWebsocketService } from './services/swarm-websocket.service';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';
import { AdvisorScrollableListComponent } from './components/advisor-scrollable-list/advisor-scrollable-list.component';
import { SwarmCardComponent } from './components/swarm-card/swarm-card.component';

@NgModule({
  imports: [
    SharedModule,
    ForumModule,
    LoaderModule,
    TranslateModule,
    SwarmSessionsSharedModule,
    SwarmSessionsRoutingModule,
    StoreModule.forFeature('swarmSessions', reducers),
    EffectsModule.forFeature([AnswersEffect, QuestionsEffect, SessionsEffect])
  ],
  providers: [
    SwarmSessionsService,
    UiConfigProvider,
    SwarmWebsocketService
  ],
  declarations: [
    QuestionsListComponent,
    QuestionDetailComponent,
    QuestionCreateComponent,
    QuestionEditComponent,
    AdvisorScrollableListComponent,
    SwarmCardComponent
  ],
  entryComponents: []
})
export class SwarmSessionsModule { }
