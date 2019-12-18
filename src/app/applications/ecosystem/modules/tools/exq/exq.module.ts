import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ShareButtonsModule } from '@ngx-share/buttons';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';
import { reducer } from './store/exq.reducer';
import {
  SurveyFormLayoutComponent,
  SurveyCardComponent,
  SurveyResultsComponent,
} from './components';
import { ExqRoutingModule } from './exq-routing.module';
import { ExqService } from './service/exq.service';
import { ExqEffect } from './store/exq.effect';
import {
  SurveyFormComponent
} from './components/survey-form-layout/survey-form/survey-form.component';
import { ExqGuard } from './guards/exq.guard';
import { SectionsExqPipe } from './sections-exq.pipe';
import {
  SurveyLayoutComponent,
  SurveyListComponent
} from '@ecosystem/modules/tools/exq/containers';
import { CopyToClipboardService } from '@profile/services/copy-to-clipboard.service';
import {
  ShareSurveyDialogComponent
} from '@ecosystem/modules/tools/exq/dialogs/share-survey-dialog/share-survey-dialog.component';
import { ExqAgreementGuard } from '@ecosystem/modules/tools/exq/guards/exq-agreement.guard';

@NgModule({
  imports: [
    ExqRoutingModule,
    SharedModule,
    StoreModule.forFeature('surveys', reducer),
    EffectsModule.forFeature([ExqEffect]),
    ShareButtonsModule,
    LoaderModule,
    ReactiveFormsModule,
    EditorModule,
  ],
  providers: [
    ExqService,
    ExqGuard,
    ExqAgreementGuard,
    CopyToClipboardService
  ],
  declarations: [
    SurveyListComponent,
    SurveyFormComponent,
    SurveyFormLayoutComponent,
    SurveyCardComponent,
    SurveyResultsComponent,
    SectionsExqPipe,
    SurveyLayoutComponent,
    ShareSurveyDialogComponent
  ],
  entryComponents: [ShareSurveyDialogComponent],
})
export class ExqModule {
}
