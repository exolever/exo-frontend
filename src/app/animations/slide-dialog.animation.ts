import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';
import {
  STATE_ENTER, STATE_LEAVE, STATE_VOID
} from '@ecosystem-media-library/components/overlay-media/overlay-media.conf';

export const slideDialogAnimation: AnimationTriggerMetadata = trigger('slideDialog', [
  state(STATE_VOID, style({ transform: 'translateY(25%) scale(0.9)', opacity: 0 })),
  state(STATE_ENTER, style({ transform: 'translateY(0%) scale(1)', opacity: 1 })),
  state(STATE_LEAVE, style({ transform: 'translateY(25%)', opacity: 0 })),
  transition('* => *', animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
]);
