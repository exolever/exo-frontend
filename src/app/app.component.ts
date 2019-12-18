import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent, NavigationEnd } from '@angular/router';

import { TrackingService } from '@core/services/tracking/tracking.service';
@Component({
  selector: 'app-root',
  template: `
    <app-full-screen-spinner-loader *ngIf="showLoader" [isGlobal]="true"></app-full-screen-spinner-loader>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  showLoader: boolean;

  constructor(
    private tracking: TrackingService,
    private router: Router
  ) {}

  ngOnInit() {
    /**
     * subscribe to the router to detect the event type and activate the loader
     * when loading a new route
     */

    this.router.events.subscribe( (event: RouterEvent) => {
      if (event instanceof RouteConfigLoadStart) {
        this.showLoader = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.showLoader = false;
      } else if (event instanceof NavigationEnd) {
        this.tracking.page(event.urlAfterRedirects);
      }
    });
  }
}
