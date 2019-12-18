import {
  Component, OnInit, Input, Output, OnDestroy, EventEmitter
} from '@angular/core';

import { Subscription } from 'rxjs';

import { OnboardingInvitationModel } from '@applications/registration/models/onboarding-invitation.model';
import { UserModel } from '@core/models/user/user.model';
import { Category, Event, EventParams } from '@core/enums/analytics.enum';
import { TrackingService } from '@core/services/tracking/tracking.service';

import { OnboardingStepperService } from '../../onboarding-stepper.service';

@Component({
  selector: 'app-step-0',
  templateUrl: './step-0.component.html',
  styleUrls: ['./step-0.component.scss']
})
export class Step0Component implements OnInit, OnDestroy {
  private subscription: Subscription;
  isActive = false;

  @Input() invitation: OnboardingInvitationModel;
  @Input() user: UserModel;

  @Output() goTo = new EventEmitter<Object>();

  constructor(
    private tracking: TrackingService,
    private onboardingStepService: OnboardingStepperService
  ) { }

  ngOnInit() {
    this.subscription = this.onboardingStepService.stepToShow$.subscribe(
      s => this.isActive = this.onboardingStepService.getCurrentStep() === 0);
  }

  goAhead() {
    this.tracking.track(Category.ONBOARDING, Event.UPDATED, { onboarding_actionDone: EventParams.WELCOME_READ });
    this.goTo.emit({ step: 1 });
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
