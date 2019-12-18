import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const workspaceRoutes: Routes = [
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(workspaceRoutes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
