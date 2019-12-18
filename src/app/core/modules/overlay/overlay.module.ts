import { NgModule } from '@angular/core';
import {
  MatDialogModule, MatIconModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { OverlayTemplateComponent } from '@overlay/components/overlay-template.component';
import { OverlayService } from '@overlay/services/overlay.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatDialogModule,
    FlexLayoutModule,
  ],
  declarations: [
    OverlayTemplateComponent,
  ],
  exports: [
    OverlayTemplateComponent
  ],
  providers: [
    OverlayService
  ]
})

export class OverlayModule { }
