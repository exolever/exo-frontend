import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectsListComponent } from './components/project-list/projects-list.component';
import { ContainerComponent } from './components/project-edition/container/container.component';
import {
  ProjectGeneralInformationComponent
} from './components/project-edition/project-general-information/project-general-information.component';
import { ProjectTeamsComponent } from './components/project-edition/project-teams/project-teams.component';
import { ProjectSettingsComponent } from './components/project-edition/project-settings/project-settings.component';
import { ProjectEditionGuard } from './edit-project.guard';
import {
  ProjectStepsComponent
} from './components/project-edition/project-steps/project-steps.component';
import {
  ProjectMembersComponent
} from './components/project-edition/project-members/project-members.component';
import { ProjectProfileComponent } from './components/project-profile/project-profile.component';

export const projectsRoutes: Routes = [
  {
    path: 'create',
    component: ProjectCreateComponent,
    canDeactivate: [ProjectEditionGuard]
  },
  {
    path: ':projectPk/summary',
    component: ProjectProfileComponent
  },
  {
    path: ':projectPk/edit',
    component: ContainerComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'general' },
      {
        path: 'general',
        component: ProjectGeneralInformationComponent,
        canDeactivate: [ProjectEditionGuard]
      },
      {
        path: 'members',
        component: ProjectMembersComponent,
        canDeactivate: [ProjectEditionGuard]
      },
      {
        path: 'teams',
        component: ProjectTeamsComponent,
        canDeactivate: [ProjectEditionGuard]
      },
      {
        path: 'steps',
        component: ProjectStepsComponent,
        canDeactivate: [ProjectEditionGuard]
      },
      {
        path: 'settings',
        component: ProjectSettingsComponent,
        canDeactivate: [ProjectEditionGuard]
      }
    ]
  },
  {
    path: '',
    component: ProjectsListComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(projectsRoutes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
