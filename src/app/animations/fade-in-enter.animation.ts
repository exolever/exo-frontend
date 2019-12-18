import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations';

export const fadeIntEnterAnimation: AnimationTriggerMetadata = trigger('transitionFadeInEnter', [
  transition(':enter', [
    style({ opacity: '0' }),
    animate('1000ms ease-in', style({ opacity: '1' })),
  ])
]);
