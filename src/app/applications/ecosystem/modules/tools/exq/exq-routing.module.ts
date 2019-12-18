import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SurveyFormLayoutComponent, SurveyResultsComponent } from './components';
import { SurveyLayoutComponent, SurveyListComponent } from '@ecosystem/modules/tools/exq/containers';

const routes: Routes = [
  {
    path: '',
    component: SurveyLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: SurveyListComponent
      }
    ],
  },
  {
    path: 'new',
    component: SurveyFormLayoutComponent,
  },
  {
    path: 'edit/:pk',
    component: SurveyFormLayoutComponent
  },
  {
    path: ':pk/results',
    component: SurveyResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ExqRoutingModule { }
