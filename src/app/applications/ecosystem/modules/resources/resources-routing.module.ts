import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';

export const resourcesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'media',
        loadChildren: () =>
          import('@ecosystem-media-library/ecosystem-media-library.module').then(m => m.EcosystemMediaLibraryModule)
      },
      {
        path: 'books',
        component: BooksComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(resourcesRoutes)],
  exports: [RouterModule],
})
export class ResourcesRoutingModule {
}
