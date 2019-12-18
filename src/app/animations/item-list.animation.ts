import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations';

export const itemListAnimation: AnimationTriggerMetadata = trigger('transitionItemList', [
    transition(':enter', [
      style({ opacity: '0' }),
      animate('500ms ease-in', style({ opacity: '1' })),
    ]),
    transition(':leave', [
      style({ opacity: '1' }),
      animate('300ms ease-out', style({ opacity: '0' })),
    ])
]);
