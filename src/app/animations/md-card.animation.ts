import { AnimationTriggerMetadata, animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const MatCardAnimation: AnimationTriggerMetadata = trigger('detailStatus', [
  state('hidden', style({
    height: '0px',
    opacity: 0,
    display: 'none'
  })),
  state('visible', style({
    height: 'auto',
    opacity: 1,
    display: 'auto'
  })),
  transition('hidden => visible',
    animate('250ms ease-in',
      keyframes([
        style({ opacity: 0.15, height: 'auto' }),
        style({ opacity: 0.30 }),
        style({ opacity: 0.45 }),
        style({ opacity: 0.60 }),
        style({ opacity: 0.80 }),
        style({ opacity: 1 })
      ])
    )
  ),
  transition('visible => hidden',
    animate('250ms ease-out',
      keyframes([
        style({ opacity: 1 }),
        style({ opacity: 0.80 }),
        style({ opacity: 0.60 }),
        style({ opacity: 0.45 }),
        style({ opacity: 0.30 }),
        style({ opacity: 0.15, height: '0' }),
      ])
    )
  )
]);

