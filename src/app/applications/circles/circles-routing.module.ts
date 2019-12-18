import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedComponent } from './components/feed/feed.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ContainerComponent } from './components/container/container.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { CircleCreateComponent } from './components/circle-create/circle-create.component';
import { CircleEditComponent } from './components/circle-edit/circle-edit.component';

import { CompatibilityGuard } from './services/compatibility.guard';
import { CircleAccessComponent } from './components/circle-access/circle-access.component';

export const circlesRoutes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children : [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full'
      },
      {
        path: 'feed',
        component: FeedComponent
      },
      {
        path: 'summary',
        component: SummaryComponent
      }
    ]
  },
  {
    path: 'create',
    component: CircleCreateComponent
  },
  {
    path: 'access',
    component: CircleAccessComponent
  },
  /**
   * Next url is needed to keep the compatibility with legacy links sent with old routing.
   * The guard 'canActivate' request to backend information to transform the old link in a new one.
   * If the post was removed, it is redirected (into the guard) to route for QuestionCreateComponent
   */
  {
    path: 'detail/:slug',
    canActivate: [CompatibilityGuard]
  },
  {
    path: ':circleSlug/create',
    component: QuestionCreateComponent
  },
  {
    path: ':circleSlug/edit',
    component: CircleEditComponent
  },
  {
    path: ':circleSlug',
    component: QuestionsListComponent
  },
  {
    path: ':circleSlug/:questionSlug/edit',
    component: QuestionEditComponent
  },
  {
    path: ':circleSlug/:questionSlug',
    component: QuestionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(circlesRoutes)],
  exports: [RouterModule],
  providers: [CompatibilityGuard]
})
export class CirclesRoutingModule { }
