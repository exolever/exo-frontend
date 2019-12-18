import { OverlayRef } from '@angular/cdk/overlay';

import { Subject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { OverlayMediaComponent } from './components/overlay-media.component';
import { ANIMATION_DONE, ANIMATION_LEAVE, ANIMATION_START } from './overlay-media.conf';

export class OverlayMediaReference {

  private _beforeClose = new Subject<void>();
  private _afterClosed = new Subject<void>();

  componentInstance: OverlayMediaComponent;

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.componentInstance.animationStateChanged.pipe(
      filter(event => event.phaseName === ANIMATION_START),
      take(1)
    ).subscribe(() => {
      this._beforeClose.next();
      this._beforeClose.complete();
      this.overlayRef.detachBackdrop();
    });

    this.componentInstance.animationStateChanged.pipe(
      filter(event => event.phaseName === ANIMATION_DONE && event.toState === ANIMATION_LEAVE),
      take(1)
    ).subscribe(() => {
      this.overlayRef.dispose();
      this._afterClosed.next();
      this._afterClosed.complete();

      this.componentInstance = null!;
    });

    this.componentInstance.startExitAnimation();
  }

  afterClosed(): Observable<void> {
    return this._afterClosed.asObservable();
  }

  beforeClose(): Observable<void> {
    return this._beforeClose.asObservable();
  }
}
