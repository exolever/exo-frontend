import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { ForumModule } from '@applications/forum/forum.module';
import { LoaderModule } from '@loaders/loader.module';

import { AskToEcosystemRoutingModule } from './ask-to-ecosystem-routing.module';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { AskToEcosystemService } from './services/ask-to-ecosystem.service';
import { reducers } from './store/reducer/index';
import { AnswersEffect } from './store/effect/answers.effect';
import { QuestionsEffect } from './store/effect/questions.effect';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';

@NgModule({
  imports: [
    SharedModule,
    ForumModule,
    LoaderModule,
    TranslateModule,
    AskToEcosystemRoutingModule,
    StoreModule.forFeature('askToEcosystem', reducers),
    EffectsModule.forFeature([AnswersEffect, QuestionsEffect])
  ],
  providers: [
    AskToEcosystemService
  ],
  declarations: [
    QuestionsListComponent,
    QuestionDetailComponent,
    QuestionCreateComponent,
    QuestionEditComponent
  ],
  entryComponents: []
})
export class AskToEcosystemModule { }
