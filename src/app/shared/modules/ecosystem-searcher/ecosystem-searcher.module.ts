import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatAutocompleteModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';
import { ExOAvatarSystemModule, ExOAvatarModule } from '@openexo/design-system';

import { DirectivesModule } from '@shared/directives/directives.module';
import { PipeModule } from '@shared/pipes/pipes.module';

import { EcosystemSearcherComponent } from './components/ecosystem-searcher.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DirectivesModule,
    DragDropModule,
    TranslateModule,
    PipeModule,
    ExOAvatarSystemModule,
    ExOAvatarModule
  ],
  declarations: [
    EcosystemSearcherComponent
  ],
  exports: [
    EcosystemSearcherComponent
  ]
})
export class EcosystemSearcherModule {
}
