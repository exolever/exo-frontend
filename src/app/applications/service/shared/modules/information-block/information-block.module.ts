import { NgModule } from '@angular/core';

import { TasksModule } from '@applications/service/shared/modules/tasks/tasks.module';
import { ExoCommonModule } from '@shared/exo-common.module';
import { PipeModule } from '@shared/pipes/pipes.module';

import { InformationBlockComponent } from './components/information-block/information-block.component';
import { AdvicesBlockComponent } from './components/advices/advices-block/advices-block.component';
import { AdviceItemComponent } from './components/advices/advice-item/advice-item.component';
import { TextComponent } from './components/text/text.component';
import { VideoComponent } from './components/video/video.component';
import { ResourceBlockComponent } from './components/resource-block/resource-block.component';
import { TasksBlockComponent } from './components/tasks-block/tasks-block.component';
import { EcosystemMediaLibraryModule } from '@ecosystem-media-library/ecosystem-media-library.module';
import { OverlayModule } from '@overlay/overlay.module';

@NgModule({
  imports: [
    PipeModule,
    ExoCommonModule,
    EcosystemMediaLibraryModule,
    TasksModule,
    OverlayModule
  ],
  declarations: [
    InformationBlockComponent,
    AdvicesBlockComponent,
    AdviceItemComponent,
    TextComponent,
    VideoComponent,
    ResourceBlockComponent,
    TasksBlockComponent,
  ],
  exports: [
    InformationBlockComponent,
    AdvicesBlockComponent,
    AdviceItemComponent,
    TextComponent,
    VideoComponent,
    ResourceBlockComponent,
    TasksBlockComponent
  ],
})
export class InformationBlockModule { }
