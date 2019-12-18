import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { FileSizePipe } from './shared/pipes';
import { globalResourceConfig, RESOURCES_CONFIG } from './resource.config.service';
import { ResourcesService, DeserializeResourceService } from './shared/services';
import {
  AddResourceComponent, LinkDialogComponent,
  ListResourcesComponent, ResourcesComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule
  ],
  providers: [FileSizePipe, ResourcesService, DeserializeResourceService,
    { provide: RESOURCES_CONFIG, useValue: globalResourceConfig }
  ],
  declarations: [FileSizePipe, AddResourceComponent, LinkDialogComponent, ListResourcesComponent, ResourcesComponent],
  exports: [AddResourceComponent, ListResourcesComponent, ResourcesComponent],
  entryComponents: [LinkDialogComponent]
})
export class ResourcesModule {}
