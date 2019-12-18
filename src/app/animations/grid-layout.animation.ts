import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations';

export const transitionGridLayout: AnimationTriggerMetadata = trigger('transitionGridLayout', [
    transition(':leave', [
      style({ opacity: '1' }),
      animate('300ms ease-out', style({ opacity: '0' })),
    ])
]);
