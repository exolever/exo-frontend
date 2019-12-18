import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CirclesRoutingModule } from '@applications/circles/circles-routing.module';
import { EcosystemNavbarModule } from '@applications/ecosystem-navbar/ecosystem-navbar.module';
import { BreadcrumbModule } from '@applications/breadcrumb/breadcrumb.module';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';
import { ForumModule } from '@forum/forum.module';
import { CertificatesModule } from '@applications/certificates/certificates.module';
import { FilestackService } from '@core/services/filestack.service';

import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { FeedComponent } from './components/feed/feed.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ContainerComponent } from './components/container/container.component';
import { CircleCreateComponent } from './components/circle-create/circle-create.component';
import { MembersWrapperComponent } from './components/members-wrapper/members-wrapper.component';
import { NewCirclesWrapperComponent } from './components/new-circles-wrapper/new-circles-wrapper.component';
import { CirclesFormComponent } from './components/circles-form/circles-form.component';
import { CircleEditComponent } from './components/circle-edit/circle-edit.component';
import { CirclesShortcutsComponent } from './components/circles-shortcuts/circles-shortcuts.component';
import { CircleAccessComponent } from './components/circle-access/circle-access.component';

import { CircleService } from './services/circle.service';
import { CircleDeserializerService } from './services/circle-deserializer.service';
import { JoinResolver } from './services/join.resolver';

import { reducers } from './store/reducer';
import { AnswersEffect } from './store/effect/answers.effect';
import { QuestionsEffect } from './store/effect/questions.effect';
import { CirclesEffect } from './store/effect/circles.effect';

@NgModule({
  imports: [
    EcosystemNavbarModule,
    CirclesRoutingModule,
    SharedModule,
    LoaderModule,
    ForumModule,
    CertificatesModule,
    BreadcrumbModule,
    StoreModule.forFeature('circles', reducers),
    EffectsModule.forFeature([AnswersEffect, QuestionsEffect, CirclesEffect]),
    MatStepperModule,
  ],
  declarations: [
    QuestionCreateComponent,
    QuestionDetailComponent,
    QuestionEditComponent,
    QuestionsListComponent,
    FeedComponent,
    SummaryComponent,
    ContainerComponent,
    CirclesShortcutsComponent,
    MembersWrapperComponent,
    CircleCreateComponent,
    CircleAccessComponent,
    NewCirclesWrapperComponent,
    CirclesFormComponent,
    CircleEditComponent
  ],
  providers: [
    CircleService,
    CircleDeserializerService,
    FilestackService,
    JoinResolver,
  ],
  exports: [],
  schemas: []
})
export class CirclesModule { }
