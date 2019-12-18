import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileContainerComponent } from './container/profile-container/profile-container.component';
import { AccountComponent } from '@applications/profile/components/account/account.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':slug',
        children: [
          {
            path: '',
            component: ProfileContainerComponent
          },
          {
            path: 'edit',
            loadChildren: () => import('../profile-edition/profile-edition.module').then(m => m.ProfileEditionModule),
          }
        ],
      },
      {
        path: 'accounts',
        children: [
          {
            path: ':pk',
            component: AccountComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
