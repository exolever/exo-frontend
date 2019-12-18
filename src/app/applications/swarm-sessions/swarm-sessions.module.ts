import { SwarmBreadcrumbManagerService } from './services/swarm-breadcrumb-manager.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { ForumModule } from '@applications/forum/forum.module';
import { LoaderModule } from '@loaders/loader.module';

import { SwarmSessionsSharedModule } from './sharedModule/swarm-sessions-shared.module';
import { SwarmSessionsRoutingModule } from './swarm-sessions-routing.module';
import { SwarmSessionsService } from './services/swarm-sessions.service';

import { reducers } from './store/reducer/index';
import { AnswersEffect } from './store/effect/answers.effect';
import { QuestionsEffect } from './store/effect/questions.effect';

import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { SwarmWebsocketService } from './services/swarm-websocket.service';

@NgModule({
  imports: [
    SharedModule,
    SwarmSessionsSharedModule,
    ForumModule,
    LoaderModule,
    TranslateModule,
    SwarmSessionsRoutingModule,
    StoreModule.forFeature('swarmSessions', reducers),
    EffectsModule.forFeature([AnswersEffect, QuestionsEffect])
  ],
  providers: [
    SwarmSessionsService,
    SwarmBreadcrumbManagerService,
    SwarmWebsocketService
  ],
  declarations: [
    QuestionsListComponent,
    QuestionDetailComponent
  ],
  entryComponents: []
})
export class SwarmSessionsModule { }
