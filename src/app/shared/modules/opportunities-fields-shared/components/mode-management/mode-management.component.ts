import { Component, OnInit, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { IGooglePlace } from '@shared/directives/google-places/google-place.interface';
import { urlValidator } from '@shared/custom-validations/';
import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';
import { SowInterface } from '@applications/ecosystem/modules/opportunities/models/opportunity.interface';
import { OpportunityMode } from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';


@Component({
  selector: 'app-mode-management',
  templateUrl: './mode-management.component.html',
  styleUrls: ['./mode-management.component.scss']
})
export class ModeManagementComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: OpportunityModel | SowInterface;
  @Input() isRequired = false;
  @Input() isSubmitted = false;
  form = new FormGroup({});
  subscription = new Subscription();
  modes = OpportunityMode;

  ngOnInit() {
    this.initializeModeFields();
    if (this.isRequired) {
      this.manageChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.data && changes.data.currentValue) {
      this.initializeModeFields();
    }
    if (changes.isSubmitted && changes.isSubmitted.currentValue) {
      this.form.markAllAsTouched();
    }
  }

  manageChanges() {
    this.subscription.add(
      this.form.get('mode').valueChanges.subscribe(value => {
        value === OpportunityMode.online
          ? this.form.get('locationUrl').setValidators([Validators.required, urlValidator()])
          : this.form.get('locationUrl').setValidators(null);
        this.form.get('locationUrl').updateValueAndValidity();

        value === OpportunityMode.onSite ? this.form.get('location').setValidators(Validators.required)
          : this.form.get('location').setValidators(null);
      })
    );
  }

   // onSelect event emitter Google Place location.
   setLocation(addrObj: IGooglePlace) {
    this.form.get('location').setValue(addrObj.name);
    this.form.get('placeId').setValue(addrObj.placeId);
    this.showLocationErrors();
  }

  isOnSite(): boolean {
    return this.form.get('mode').value === OpportunityMode.onSite;
  }

  isOnLine(): boolean {
    return this.form.get('mode').value === OpportunityMode.online;
  }


  /**
   * We have three modes TBD/onSite/online:
   * - By default will be TBD (To be defined).
   * - If the user select onSite the fields location/placeId is optional
   * - If the user select online the fields locationUrl is optional
  */
  initializeModeFields() {
    const modeValue = this.data
      ? this.data.mode ? this.data.mode : OpportunityMode.toBeDefined
      : OpportunityMode.onSite;
    const modeControl = new FormControl(modeValue, Validators.required);
    this.form.get('mode') ?
      this.form.setControl('mode', modeControl) :
      this.form.addControl('mode', modeControl);

    const locationControl = new FormControl(this.data ? this.data.location : '');
    this.form.get('location') ?
      this.form.setControl('location', locationControl) :
      this.form.addControl('location', locationControl);

    const placeIdControl = new FormControl(this.data ? this.data.placeId : '');
    this.form.get('placeId') ?
      this.form.setControl('placeId', placeIdControl) :
      this.form.addControl('placeId', placeIdControl);

    const locationUrlControl = new FormControl(this.data ? this.data.locationUrl : '', urlValidator());
    this.form.get('locationUrl') ?
      this.form.setControl('locationUrl', locationUrlControl) :
      this.form.addControl('locationUrl', locationUrlControl);

    if (this.isRequired) {
      this.initializeValidators();
    }
  }

  initializeValidators(): void {
    if (this.isOnLine()) {
      this.form.get('locationUrl').setValidators([Validators.required, urlValidator()]);
      this.form.get('locationUrl').updateValueAndValidity();
    }

    if (this.isOnSite()) {
      this.form.get('location').setValidators(Validators.required);
      this.form.get('location').updateValueAndValidity();
    }
  }

  showLocationErrors() {
    if (this.form.get('placeId').errors) {
      this.form.get('location').setErrors({ 'autoCompleteValidator': true });
      this.form.get('location').markAsTouched();
    }
  }

  preventChangeWithErrors($event: Event) {
    // if (this.form.get('location').value && this.form.get('location').errors) {
    //   $event.stopPropagation();
    //   $event.preventDefault();
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}



