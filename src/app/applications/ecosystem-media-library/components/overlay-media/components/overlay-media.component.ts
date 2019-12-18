import { Component, EventEmitter, Inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import {
  overlayFadeAnimation,
  overlaySlideContent
} from '@ecosystem-media-library/components/overlay-media/components/overlay-media.animation';
import {  OverlayMediaReference } from '@ecosystem-media-library/components/overlay-media/overlay-media-ref';
import {
  STATE_ANIMATION,
  STATE_ENTER,
  STATE_LEAVE,
  VIDEO_DIALOG_DATA
} from '@ecosystem-media-library/components/overlay-media/overlay-media.conf';

@Component({
  templateUrl: './overlay-media.component.html',
  styleUrls: ['./overlay-media.component.scss'],
  animations: [overlayFadeAnimation, overlaySlideContent]
})
export class OverlayMediaComponent {

  animationState: STATE_ANIMATION = STATE_ENTER;
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    public dialogRef: OverlayMediaReference,
    @Inject(VIDEO_DIALOG_DATA) public data: any
    ) { }

  closeOverlay() {
    this.dialogRef.close();
  }

  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  startExitAnimation() {
    this.animationState = STATE_LEAVE;
  }
}
