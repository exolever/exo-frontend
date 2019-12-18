import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MyJobsComponent } from './components/my-jobs.component';

const routes: Routes = [
  { path: '', component: MyJobsComponent, pathMatch: 'full' },
  { path: 'swarm-session',
    loadChildren: () =>
      import('../swarm-sessions/swarm-sessions.module').then(m => m.SwarmSessionsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJobsRoutingModule {}
