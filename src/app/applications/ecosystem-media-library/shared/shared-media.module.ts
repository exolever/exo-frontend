
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { FilestackService } from '@core/services/filestack.service';
import { ResourceItemComponent } from '../components/resource-item/resource-item.component';
import { OverlayMediaService } from '../components/overlay-media/services/overlay-media.service';
import { OverlayMediaComponent } from '../components/overlay-media/components/overlay-media.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ResourceItemComponent,
    OverlayMediaComponent,
  ],
  providers: [
    OverlayMediaService,
    FilestackService
  ],
  exports: [
    SharedModule,
    ResourceItemComponent,
    OverlayMediaComponent,
  ]
})
export class SharedMediaModule {}
