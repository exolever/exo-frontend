import { NgModule } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { BrowserUnsupportedComponent, NotFoundComponent } from '@core/components';
import { BrowserGuard } from '@core/guards/browser.guard';
import { locationFactory } from '@core/services/location.factory';
import { RedirectToGuard } from './routing/guards/redirect-to.guard';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

const routesApp: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [RedirectToGuard],
    children: []
  },
  {
    path: '',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule),
    canActivateChild: [BrowserGuard]
  },
  {
    path: '',
    loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule),
    canActivateChild: [BrowserGuard]
  },
  { path: 'browser-not-supported', component: BrowserUnsupportedComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routesApp, {
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: [
    PromptDialogService,
    BrowserGuard,
    { provide: Location, useFactory: locationFactory, deps: [LocationStrategy] },
  ]
})
export class AppRoutingModule { }
