import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EarlyParrotComponent } from '@applications/early-parrot/containers/early-parrot.component';
import { EarlyParrotResolver } from '@applications/early-parrot/services/early-parrot.resolver';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EarlyParrotComponent,
    resolve: {
      campaign: EarlyParrotResolver
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class EarlyParrotRoutingModule { }
