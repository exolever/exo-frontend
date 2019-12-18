import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ExoCommonModule } from '../../exo-common.module';
import { PipeModule } from '../../pipes/pipes.module';
import { PromptDialogComponent } from './prompt-dialog.component';
import { PromptDialogService } from './prompt-dialog.service';

@NgModule({
  imports: [
    ExoCommonModule,
    ReactiveFormsModule,
    PipeModule
  ],
  providers: [PromptDialogService],
  declarations: [PromptDialogComponent],
  exports: [PromptDialogComponent],
  entryComponents: [PromptDialogComponent]
})
export class PromptDialogModule { }
