import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';

const routes: Routes = [
  { path: ':pkSession', component: QuestionsListComponent },
  { path: ':pkSession/:pkQuestion', component: QuestionDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwarmSessionsRoutingModule {}
