import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutMediaComponent } from './components/layout-media/layout-media.component';

const routesMediaLibrary: Routes = [
  {
    path: '',
    component: LayoutMediaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesMediaLibrary)],
  exports: [RouterModule]
})
export class EcosystemMediaLibraryRoutingModule { }
