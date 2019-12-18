import { NgModule } from '@angular/core';
import { BreadcrumbModule } from '@applications/breadcrumb/breadcrumb.module';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';

import { ResourcesRoutingModule } from './resources-routing.module';
import { BooksComponent } from './books/books.component';

@NgModule({
  imports: [
    ResourcesRoutingModule,
    SharedModule,
    LoaderModule,
    BreadcrumbModule,
  ],
  declarations: [
    BooksComponent,
  ],
  providers: [],
  entryComponents: [],
  exports: []
})
export class ResourcesModule {
}
