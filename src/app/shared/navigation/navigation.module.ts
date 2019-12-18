import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { ExoButtonModule } from '@openexo/design-system/';


import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from '@shared/navigation/navigation.service';

import { BackToSnippetComponent } from './back-to-snippet/back-to-snippet.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    TranslateModule,
    MatIconModule,
    ExoButtonModule
  ],
  declarations: [BackToSnippetComponent],
  providers: [NavigationService],
  exports: [BackToSnippetComponent]
})
export class NavigationModule { }
