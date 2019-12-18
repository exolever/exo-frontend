import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayModule } from '@overlay/overlay.module';
import { SharedModule } from '@shared/shared.module';
import { SharedMediaModule } from '@ecosystem-media-library/shared/shared-media.module';
import { LoaderModule } from '@loaders/loader.module';

import { CrudEffects } from './store/crud/crud.effect';
import { reducers } from './store/reducers';
import { EcosystemMediaLibraryRoutingModule } from './ecosystem-media-library-routing.module';
import { FilterOptionsService } from './services/filter.service';
import { LayoutMediaComponent } from './components/layout-media/layout-media.component';
import { MediaLibraryConfigProvider } from './ecosystem-media-library.conf';
import { MediaFiltersComponent } from './components/media-filters/media-filters.component';
import { MediaGridComponent } from './components/grid/media-grid.component';
import { MediaLibraryWebsocketService } from './store/real-time.service';
import { OverlayMediaComponent } from './components/overlay-media/components/overlay-media.component';
import { OverlayMediaService } from './components/overlay-media/services/overlay-media.service';
import { ResourceCardComponent } from './components/resource-card/resource-card.component';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { ResourcesService } from './services/resources.service';
import { SearchComponent } from './components/search/search.component';
import { SearchEffects } from './store/search/search.effect';
import { SorterComponent } from './components/sorter/sorter.component';
import { ResourceUploaderComponent } from './components/resource-uploader/resource-uploader.component';

@NgModule({
  imports: [
    SharedModule,
    LoaderModule,
    SharedMediaModule,
    MatGridListModule,
    EcosystemMediaLibraryRoutingModule,
    OverlayModule,
    StoreModule.forFeature('mediaLibrary', reducers),
    EffectsModule.forFeature([SearchEffects, CrudEffects])
  ],
  declarations: [
    LayoutMediaComponent,
    MediaFiltersComponent,
    MediaGridComponent,
    ResourceCardComponent,
    ResourceFormComponent,
    ResourceUploaderComponent,
    SearchComponent,
    SorterComponent
  ],
  providers: [
    FilterOptionsService,
    MediaLibraryConfigProvider,
    MediaLibraryWebsocketService,
    OverlayMediaService,
    OverlayService,
    ResourcesService
  ],
  exports: [
    SharedMediaModule,
    LayoutMediaComponent,
    ResourceUploaderComponent,
    MediaGridComponent
  ],
  entryComponents: [
    MediaFiltersComponent,
    OverlayMediaComponent,
    ResourceFormComponent
  ]
})
export class EcosystemMediaLibraryModule {}
