import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import * as Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import ImageResize from 'quill-image-resize-module';
import { ImageCropperModule } from 'ngx-img-cropper';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { ExOAvatarSystemModule, ExOAvatarModule, ExoAlertModule } from '@openexo/design-system';

import { ExoCommonModule } from '@shared/exo-common.module';
import { OverlayModule } from '@overlay/overlay.module';

import { MatPopoverModule } from './popover';
import { AlertComponent } from './alert/alert.component';
import { ChipsAutocompleteComponent } from './chips-autocomplete/chips-autocomplete.component';
import { FeedbackMessageComponent } from './feedback-message/feedback-message.component';
import { FilterComponent } from './filter/filter.component';
import { InviteModalComponent } from './invite-member-dialog/invite-member-dialog.component';
import { DisplayAttachedComponent } from './upload-resources/display-attached/display-attached.component';
import { MaterialIconStarRatingComponent } from './material-icon-star-rating/material-icon-star-rating.component';
import { PasswordinputComponent } from './passwordinput/passwordinput.component';
import { TypeFormIntegrationComponent } from './typeform-integration/typeform-integration.component';
import { UploadedFilesListComponent } from './upload-resources/uploaded-files-list/uploaded-files-list.component';
import {
  FilestackAttachButtonComponent
} from './upload-resources/filestack-attach-button/filestack-attach-button.component';
import { CropperComponent } from './cropper/cropper.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { HelpPopoverComponent } from './help-popover/help-popover.component';
import { ForumIconComponent } from '@shared/components/forum-icon/forum-icon.component';
import { EmptyMomentComponent } from '@shared/components/empty-moment/empty-moment.component';
import {
  ExoRouterTabsComponent,
  RouterTabDirective,
  RouterTabsDirective
} from '@shared/components/exo-router-tabs/exo-router-tabs.component';
import { Error410Component } from '@shared/components/error-410/error-410.component';
import { PipeModule } from '@shared/pipes/pipes.module';

import { ProfilePicComponent } from './profile-pic/profile-pic.component';
import {
  RequiredCertificationDialogComponent
} from '@shared/components/dialogs/required-certification-dialog/required-certification-dialog.component';
import { CustomQuillEditorComponent } from '@shared/components/custom-quill-editor/custom-quill-editor.component';

Quill.register('modules/magicUrl', MagicUrl);
Quill.register('modules/imageResize', ImageResize);
@NgModule({
  imports: [
    ExoCommonModule,
    FormsModule,
    ImageCropperModule,
    OverlayModule,
    ReactiveFormsModule,
    TranslateModule,
    ExOAvatarSystemModule,
    ExOAvatarModule,
    ExoAlertModule,
    RouterModule,
    PipeModule,
    QuillModule.forRoot()
  ],
  declarations: [
    AlertComponent,
    ChipsAutocompleteComponent,
    FeedbackMessageComponent,
    FilterComponent,
    InviteModalComponent,
    MaterialIconStarRatingComponent,
    PasswordinputComponent,
    CropperComponent,
    TypeFormIntegrationComponent,
    UploadedFilesListComponent,
    UserMenuComponent,
    FilestackAttachButtonComponent,
    DisplayAttachedComponent,
    HelpPopoverComponent,
    ForumIconComponent,
    EmptyMomentComponent,
    ExoRouterTabsComponent,
    RouterTabsDirective,
    RouterTabDirective,
    ProfilePicComponent,
    Error410Component,
    CustomQuillEditorComponent,
    RequiredCertificationDialogComponent
  ],
  exports: [
    AlertComponent,
    ChipsAutocompleteComponent,
    FeedbackMessageComponent,
    FilterComponent,
    InviteModalComponent,
    MaterialIconStarRatingComponent,
    MatPopoverModule,
    PasswordinputComponent,
    CropperComponent,
    TypeFormIntegrationComponent,
    UploadedFilesListComponent,
    UserMenuComponent,
    FilestackAttachButtonComponent,
    DisplayAttachedComponent,
    ExOAvatarSystemModule,
    ExOAvatarModule,
    HelpPopoverComponent,
    ExoAlertModule,
    EmptyMomentComponent,
    ExoRouterTabsComponent,
    ForumIconComponent,
    ProfilePicComponent,
    Error410Component,
    CustomQuillEditorComponent,
    RequiredCertificationDialogComponent,
    PipeModule
  ],
  entryComponents: [CropperComponent, RequiredCertificationDialogComponent]
})
export class SharedComponentsModule { }
