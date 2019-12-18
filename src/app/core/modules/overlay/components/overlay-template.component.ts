import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
  ANIMATION_DONE, STATE_ANIMATION, STATE_ENTER, STATE_LEAVE
} from '@ecosystem-media-library/components/overlay-media/overlay-media.conf';
import { slideDialogAnimation } from '@animations/slide-dialog.animation';

@Component({
  selector: 'app-overlay-template',
  templateUrl: './overlay-template.component.html',
  styleUrls: ['./overlay-template.component.scss'],
  animations: [slideDialogAnimation]
})
export class OverlayTemplateComponent {
  animationState: STATE_ANIMATION = STATE_ENTER;
  animationStateChanged = new Subject<AnimationEvent>();

  @Input()
  title: string;

  @Input()
  isFullWidth = false;

  @Input()
  icon = 'close';

  @Input()
  avoidClose = false;

  @Output()
  close = new EventEmitter<any>();

  @Output()
  beforeClose = new EventEmitter<any>();

  onClose(event: Event) {
    this.beforeClose.emit(event);
    if (! this.avoidClose) {
      this.animationState = STATE_LEAVE;
      this.animationStateChanged.pipe(
        filter(e => e.phaseName === ANIMATION_DONE),
        take(1)
      ).subscribe(() => {
        this.close.emit(event);
      });
    }
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.next(event);
  }

}
