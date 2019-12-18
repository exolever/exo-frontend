import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DirectoryComponent} from '@ecosystem/modules/directory/directory.component';

const routesDirectory: Routes = [
  {
    path: '',
    component: DirectoryComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../../../profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesDirectory)],
  exports: [RouterModule],
  providers: []
})
export class DirectoryRoutingModule {
}
