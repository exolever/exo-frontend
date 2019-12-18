import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { ExoCommonModule } from '@shared/exo-common.module';

import { SelectLevelComponent } from './select-level/select-level.component';
import { ToggleFormComponent } from './toggle-form/toggle-form.component';
import { ToggleItemComponent } from './toggle-item/toggle-item.component';

// This is a dumb module ONLY for presentational components
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    ExoCommonModule
  ],
  declarations: [
    SelectLevelComponent,
    ToggleFormComponent,
    ToggleItemComponent
  ],
  exports: [
    SelectLevelComponent,
    ToggleFormComponent,
    ToggleItemComponent
  ]
})

export class ProfileSharedModule { }
