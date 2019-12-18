import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import { OverlayModule } from '@overlay/overlay.module';
import { SharedModule } from '@shared/shared.module';
import {DirectoryComponent} from '@ecosystem/modules/directory/directory.component';
import {DirectoryRoutingModule} from '@ecosystem/modules/directory/directory-routing.module';
import {PeopleComponent} from '@ecosystem/modules/directory/people/people.component';
import {DirectoryFiltersComponent} from '@ecosystem/modules/directory/directory-filters/directory-filters.component';
import {LoaderModule} from '@loaders/loader.module';
import {reducer} from '@ecosystem/modules/directory/store/directory.reducer';
import {DirectoryEffects} from '@ecosystem/modules/directory/store/directory.effect';
import { MemberCardModule } from '@service/shared/modules/member-card/member-card.module.';


@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    MemberCardModule,
    LoaderModule,
    DirectoryRoutingModule,
    OverlayModule,
    StoreModule.forFeature('directory', reducer),
    EffectsModule.forFeature([DirectoryEffects])
  ],
  declarations: [
    DirectoryComponent,
    DirectoryFiltersComponent,
    PeopleComponent,
  ],
  exports: [
    DirectoryComponent,
    PeopleComponent,
    DirectoryFiltersComponent,
  ],
  entryComponents: [DirectoryFiltersComponent]
})
export class DirectoryEcosystemModule { }
