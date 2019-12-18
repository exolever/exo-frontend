import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

import {
  ANIMATION_TIMINGS,
  STATE_ENTER,
  STATE_LEAVE,
  STATE_VOID
} from '@ecosystem-media-library/components/overlay-media/overlay-media.conf';

export const overlayFadeAnimation: AnimationTriggerMetadata = trigger(
  'fade', [
    state('fadeOut', style({ opacity: 0 })),
    state('fadeIn', style({ opacity: 1 })),
    transition('* => fadeIn', animate(ANIMATION_TIMINGS))
  ]
);

export const overlaySlideContent: AnimationTriggerMetadata = trigger(
  'slideContent', [
    state(STATE_VOID, style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
    state(STATE_ENTER, style({ transform: 'none', opacity: 1 })),
    state(STATE_LEAVE, style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
    transition('* => *', animate(ANIMATION_TIMINGS))
  ]
);
