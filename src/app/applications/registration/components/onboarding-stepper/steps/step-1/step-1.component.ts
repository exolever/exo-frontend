import {
  Component, OnInit, OnDestroy, Output, Input, EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { IGooglePlace } from '@shared/directives/google-places/google-place.interface';
import {
  OnboardingInvitationModel,
} from '@applications/registration/models/onboarding-invitation.model';
import { Category, Event, EventParams } from '@core/enums/analytics.enum';
import { TrackingService } from '@core/services/tracking/tracking.service';

import { OnboardingStepperService } from '../../onboarding-stepper.service';

@Component({
  selector: 'app-step-1',
  templateUrl: './step-1.component.html',
  styleUrls: ['./step-1.component.scss']
})
export class Step1Component implements OnInit, OnDestroy {
  public formStep1: FormGroup;
  public croppedImage: File;
  public isActive = false;
  @Input() invitation: OnboardingInvitationModel;
  @Output() goTo = new EventEmitter<Object>();
  private onboardingServiceSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private onboardingStepService: OnboardingStepperService,
    private tracking: TrackingService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.onboardingServiceSubscription = this.onboardingStepService.stepToShow$.subscribe(
      s => this.isActive = this.onboardingStepService.getCurrentStep() === 1
    );
    this.invitation = {...this.invitation, ...this.invitation['extraData']};
    this.onboardingStepService.fillFormFromInvitation(this.invitation, this.formStep1);
  }

  changePage(stepInformation): void {
    if (this.formStep1.valid) {
      this.tracking.track(
        Category.ONBOARDING,
        Event.UPDATED,
        { onboarding_actionDone: EventParams.BASIC_INFO_FILLED }
      );
      this.goTo.emit({ step: stepInformation.step, isLast: stepInformation.isLast, data: this.dataToSend() });
    } else {
      this.showLocationErrors();
    }
  }

  showLocationErrors() {
    if (this.formStep1.get('placeId').errors) {
      this.formStep1.get('location').setErrors({ 'autoCompleteValidator': true });
      this.formStep1.get('location').markAsTouched();
    }
  }

  private buildForm(): void {
    this.formStep1 = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      shortName: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      personalMtp: ['', Validators.maxLength(144)],
      placeId: ['', Validators.required]
    });
  }

  private dataToSend(): any {
    const data = {};
    const dataForm = this.formStep1.getRawValue();
    if (this.croppedImage) {
      data['profile_picture'] = this.croppedImage['image'];
    }
    if (dataForm['personalMtp']) {
      data['personal_mtp'] = dataForm['personalMtp'];
    }
    data['location'] = dataForm['location'];
    data['full_name'] = dataForm['fullName'];
    data['short_name'] = dataForm['shortName'];
    data['place_id'] = dataForm['placeId'];
    return data;
  }

  getAvatar(): string {
    return this.croppedImage != null ?
      this.croppedImage['image'] : this.invitation ?
        this.invitation.profilePicture : '';
  }

  updateAvatar(image: File): void {
    this.croppedImage = image;
  }

  // onSelect event emitter Google Place location.
  setLocation(addrObj: IGooglePlace) {
    this.formStep1.get('location').setValue(addrObj.name);
    this.formStep1.get('placeId').setValue(addrObj.placeId);
    this.showLocationErrors();
  }

  ngOnDestroy(): void {
    if (this.onboardingServiceSubscription) { this.onboardingServiceSubscription.unsubscribe(); }
  }
}
