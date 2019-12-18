import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanvasComponent } from './canvas/canvas.component';
import { ExqGuard } from './exq/guards/exq.guard';
import { ExqAgreementGuard } from '@ecosystem/modules/tools/exq/guards/exq-agreement.guard';
import { ExqConditionsComponent } from '@ecosystem/components/exq-conditions/exq-conditions.component';
import { ToolkitComponent } from '@ecosystem/modules/tools/toolkit/toolkit.component';
import { AwakeComponent } from '@ecosystem/modules/tools/toolkit/awake/awake.component';
import { WorkshopComponent } from '@ecosystem/modules/tools/toolkit/workshop/workshop.component';
import { AwakeEnComponent } from '@ecosystem/modules/tools/toolkit/awake/awake-en/awake-en.component';
import { AwakeEsComponent } from '@ecosystem/modules/tools/toolkit/awake/awake-es/awake-es.component';

export const resourcesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'canvas',
        component: CanvasComponent
      },
      {
        path: 'exq',
        loadChildren: () => import('./exq/exq.module').then(m => m.ExqModule),
        canActivate: [ExqGuard],
        canActivateChild: [ExqAgreementGuard]
      },
      {
        path: 'exq-conditions',
        component: ExqConditionsComponent
      },
      {
        path: 'toolkit',
        component: ToolkitComponent
      },
      {
        path: 'toolkit/awake',
        component: AwakeComponent,
        children: [
          {
            path: '',
            redirectTo: 'en',
            pathMatch: 'full'
          },
          {
            path: 'en',
            component: AwakeEnComponent
          }, {
            path: 'es',
            component: AwakeEsComponent
          }
        ]
      },
      {
        path: 'toolkit/workshop',
        component: WorkshopComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(resourcesRoutes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule {}
