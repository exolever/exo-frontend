import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

import { Subscription } from 'rxjs';


@Component({
  templateUrl: './browser-unsupported.component.html',
  styleUrls: ['./browser-unsupported.component.scss']
})
export class BrowserUnsupportedComponent implements OnInit, OnDestroy {
  isLargeDevice = false;
  private subscriptions: Subscription[] = [];

  constructor(private mediaService: MediaObserver) { }

  ngOnInit() {
    this.subscriptions.push(
      this.mediaService.media$.subscribe(() => {
        this.isLargeDevice = this.mediaService.isActive('gt-sm');
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe() );
  }
}

