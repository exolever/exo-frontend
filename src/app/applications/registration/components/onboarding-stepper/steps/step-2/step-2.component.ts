import { Component, OnInit, Input, Output, ElementRef, AfterViewInit,
  EventEmitter, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { OnboardingInvitationModel } from '@applications/registration/models/onboarding-invitation.model';
import { StatusInvitationEnum } from '@shared/enums/invitation.enum';
import { Urls } from '@core/services/navigate';
import { Category, Event, EventParams } from '@core/enums/analytics.enum';
import { TrackingService } from '@core/services/tracking/tracking.service';

import { OnboardingStepperService } from '../../onboarding-stepper.service';

@Component({
  selector: 'app-step-2',
  templateUrl: './step-2.component.html',
  styleUrls: ['./step-2.component.scss']
})
export class Step2Component implements OnInit, OnDestroy, AfterViewInit {
  public isActive = false;
  private subscription = new Subscription();
  @ViewChildren('video', {read: ElementRef}) videos: QueryList<ElementRef>;

  @Output() goTo = new EventEmitter<Object>();
  @Input() invitation: OnboardingInvitationModel;
  @Input() shortName: string;
  constructor(
    private tracking: TrackingService,
    private onboardingStepService: OnboardingStepperService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription.add(this.onboardingStepService.stepToShow$.subscribe(
      s => this.isActive = this.onboardingStepService.getCurrentStep() === 2
    ));
  }

  ngAfterViewInit() {
    this.subscription.add(this.videos.changes.subscribe(() =>
      this.videos.forEach(iframe => this.tracking.trackVideo(iframe.nativeElement))
    ));
  }

  next(): void {
    if (this.invitation.status !== StatusInvitationEnum.STATUS_CH_ACTIVE) {
      this.goTo.emit({ step: 7, isLast: true });
      this.tracking.track(
        Category.ONBOARDING,
        Event.UPDATED,
        { onboarding_actionDone: EventParams.ONBOARDING_COMPLETED }
      );
    } else {
      this.router.navigate([Urls.ECOSYSTEM_CIRCLES]);
    }
  }

  previous(): void {
    this.goTo.emit({ step: 5, isLast: false });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
