import { NgModule } from '@angular/core';
import { BreadcrumbModule } from '@applications/breadcrumb/breadcrumb.module';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';

import { ToolsRoutingModule } from './tools-routing.module';
import { ExqModule } from './exq/exq.module';
import { CanvasComponent } from './canvas/canvas.component';
import { ExqConditionsComponent } from '@ecosystem/components/exq-conditions/exq-conditions.component';
import { ExqConditionsService } from '@ecosystem/components/exq-conditions/exq-contitions.service';
import { ToolkitComponent } from './toolkit/toolkit.component';
import { AwakeComponent } from './toolkit/awake/awake.component';
import { WorkshopComponent } from './toolkit/workshop/workshop.component';
import { AwakeEnComponent } from './toolkit/awake/awake-en/awake-en.component';
import { AwakeEsComponent } from './toolkit/awake/awake-es/awake-es.component';
import { SharedServiceModule } from '@service/shared/shared-service.module';

@NgModule({
  imports: [
    ToolsRoutingModule,
    SharedModule,
    LoaderModule,
    BreadcrumbModule,
    ExqModule,
    SharedServiceModule
  ],
  declarations: [
    CanvasComponent,
    ExqConditionsComponent,
    ToolkitComponent,
    AwakeComponent,
    WorkshopComponent,
    AwakeEnComponent,
    AwakeEsComponent
  ],
  providers: [ExqConditionsService],
  entryComponents: [],
  exports: []
})
export class ToolsModule {
}
