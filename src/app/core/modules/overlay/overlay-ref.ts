import { Component } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { Subject, Observable } from 'rxjs';

/**
 * This Class will be use for remote manage overlay in the component.
 * This can't be @Injectable because we need a new instance instead singleton in each component.
 */
export class OverlayReference {
  componentInstance: Component;

  private afterClosed$ = new Subject<void>();

  constructor(
    private overlayRef: OverlayRef,
    private dynamicComponent: Component
  ) {
    this.componentInstance = this.dynamicComponent;
  }

  afterClosed(): Observable<void> {
    return this.afterClosed$.asObservable();
  }

  close(data?: any): void {
    this.overlayRef.dispose();
    this.afterClosed$.next(data);
    this.afterClosed$.complete();

    /* Make sure to also clear the reference to the
    component instance to avoid memory leaks. */
    this.componentInstance = null!;
  }
}
