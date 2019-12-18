import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// modules
import { DirectivesModule } from './directives/directives.module';
import { ExoCommonModule } from './exo-common.module';
import { NavigationModule } from './navigation/navigation.module';
import { SharedComponentsModule } from './components/components.module';
import { ExOAvatarSystemModule } from '@openexo/design-system';
import { PromptDialogModule} from './modules/prompt-dialog/prompt-dialog.module';
import { EcosystemSearcherModule } from './modules/ecosystem-searcher/ecosystem-searcher.module';
import {
  RequiredEnterValidatorDirective,
  AutoCompleteValidatorDirective,
  AutoCompleteArrayValidatorDirective,
  UrlValidatorDirective,
  PositiveNumberValidatorDirective
} from './custom-validations';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { RequiredCertificationDialogComponent } from './components';

@NgModule({
  imports: [
    FontAwesomeModule,
    ExoCommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    SharedComponentsModule,
    NavigationModule,
    ExOAvatarSystemModule,
    PromptDialogModule,
    EcosystemSearcherModule
  ],
  declarations: [
    AutoCompleteArrayValidatorDirective,
    AutoCompleteValidatorDirective,
    RequiredEnterValidatorDirective,
    UrlValidatorDirective,
    PositiveNumberValidatorDirective,
  ],
  entryComponents: [
    RequiredCertificationDialogComponent
  ],
  exports: [
    FontAwesomeModule,
    ExoCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RequiredEnterValidatorDirective,
    UrlValidatorDirective,
    PositiveNumberValidatorDirective,
    DirectivesModule,
    SharedComponentsModule,
    NavigationModule,
    ExOAvatarSystemModule,
    EcosystemSearcherModule
  ],
  providers: [
    EarlyParrotService,
  ],
})
export class SharedModule {}
