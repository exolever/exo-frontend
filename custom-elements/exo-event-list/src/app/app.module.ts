import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {ElementZoneStrategyFactory} from 'elements-zone-strategy';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {MatDialogModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ExoCustomElementComponent} from './exo-custom/exo-custom.component';
import {LoaderComponent} from './exo-custom/loader/loader.component';
import {EventCardComponent} from './exo-custom/event-card/event-card.component';
import {FiltersComponent} from './exo-custom/filters/filters.component';
import {FiltersDialogComponent} from './exo-custom/filters/filters-dialog/filters-dialog.component';
import {LineClampDirective} from './exo-custom/line-clamp.directive';
import { PaginatorComponent } from './exo-custom/paginator/paginator.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    SelectDropDownModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  declarations: [
    ExoCustomElementComponent,
    LoaderComponent,
    EventCardComponent,
    FiltersComponent,
    FiltersDialogComponent,
    LineClampDirective,
    PaginatorComponent
  ],
  entryComponents: [
    ExoCustomElementComponent,
    FiltersDialogComponent
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const strategyFactory = new ElementZoneStrategyFactory(ExoCustomElementComponent, this.injector);
    const el = createCustomElement(ExoCustomElementComponent, {injector: this.injector, strategyFactory});
    customElements.define('exo-event-list', el);
  }
}
