import { Component, Input, Output, EventEmitter } from '@angular/core';
import { style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-onboarding-step',
  templateUrl: './onboarding-step.component.html',
  styleUrls: ['./onboarding-step.component.scss'],
  animations: [
    trigger('onboardingStepAnimation', [
        transition(
          ':enter', [
            style({opacity: 0}),
            // Is not working in safari yet and for this is not working properly the redimension
            // animate('500ms ease-in', style({opacity: 1}))
          ])
      ])
    ]
})
export class OnboardingStepComponent {
  @Input() order: number;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() nextButton: string;
  @Input() previousButton: string;
  @Input() isLast = false;
  @Output() goTo = new EventEmitter<Object>();
  @Input() active = false;

  next(): void {
    this.goTo.emit({ step: this.order + 1, isLast: this.isLast });
  }

  previous(): void {
    this.goTo.emit({ step: this.order - 1, isLast: false });
  }

  hide(): void {
    this.active = false;
  }

  show(): void {
    this.active = true;
  }

  isActive(): boolean {
    return this.active;
  }

  changePage(step: number): void {
    this.goTo.emit({ step: step, isLast: false });
  }
}
