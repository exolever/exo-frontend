import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KeyValue } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as MomentTZ from 'moment-timezone';
import { select, Store } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';

import { SetFocusOnInvalid } from '@shared/utils/form';
import { OverlayReference } from '@overlay/overlay-ref';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import {
  PaymentManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/payment-management/payment-management.component';
import {
  OpportunitiesFieldSharedService
} from '@shared/modules/opportunities-fields-shared/services/opportunities-fields-shared.service';
import {
  ManagementOpportunityFormService
} from '@applications/ecosystem/modules/opportunities/shared/services/management-opportunity-form.service';
import {
  OpportunityDurationUnit
} from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';
import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';
import {
  BudgetInterface,
  SowInterface
} from '@applications/ecosystem/modules/opportunities/models/opportunity.interface';
import {
  OpportunityApplicantModel
} from '@applications/ecosystem/modules/opportunities/models/opportunity-applicant.model';
import { SowService } from '@applications/ecosystem/modules/opportunities/shared/services/management-sow.service';
import {
  SowDeserializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/sow-deserializer.service';
import {
  ModeManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/mode-management/mode-management.component';
import { UserModel } from '@core/models';
import { OpportunitiesAdminService } from '../../../service/opportunities-admin.service';


@Component({
  selector: 'app-sow-form',
  templateUrl: './sow-form.component.html'
})
export class SowFormComponent implements OnInit, OnDestroy {
  @ViewChild(PaymentManagementComponent, {static: false}) paymentFieldsComponent: PaymentManagementComponent;
  @ViewChild(ModeManagementComponent, {static: false}) modeFieldsComponent: ModeManagementComponent;
  @Output() nextPage: EventEmitter<any> = new EventEmitter();
  @Input() opportunity: OpportunityModel;
  @Input() applicant: OpportunityApplicantModel;
  @Input() isEditing: boolean;
  form: FormGroup;
  private subscription = new Subscription();
  isSubmitted = false;
  minValueForEndDate: string;
  user$: Observable<UserModel>;
  listTimeZones = MomentTZ.tz.names().map(tz => tz.replace(/_/g, ' '));
  filteredTZ$: Observable<any>;
  timePickerPlaceHolder: string;
  durationUnits = OpportunityDurationUnit;
  budgets: BudgetInterface[];
  initialData: SowInterface;
  constructor(
    public service: ManagementOpportunityFormService,
    private opportunitiesAdminService: OpportunitiesAdminService,
    private sowService: SowService,
    private elRef: ElementRef,
    private overlayRef: OverlayReference,
    private store: Store<AppState>,
    private translateService: TranslateService,
    private sowDeserializerService: SowDeserializerService,
    public oppFieldSharedService: OpportunitiesFieldSharedService,
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.getDataToInitializeForm();
  }

  getDataToInitializeForm() {
    if (this.applicant.sow) {
      this.initialData = this.sowDeserializerService.deserialize(this.applicant.sow);
      this.initializeForm(this.initialData);
    } else {
      if (this.isEditing) {
        this.subscription.add(
          this.sowService.getDataSow(this.applicant.pk).subscribe(data => {
            this.initialData = data;
            this.initializeForm(this.initialData);
          })
        );
      } else {
        this.subscription.add(
          this.opportunitiesAdminService.getDataInitSow(this.applicant.pk).subscribe(data => {
            this.initialData = data;
            this.initializeForm(this.initialData);
          })
        );
      }
    }
  }

  initializeForm(initialData) {
    this.service.initializeForm(initialData);
    this.form = this.service.form;
    this.extendForm(initialData);
    this.minValueForEndDate = this.form.get('startDate').value;
    this.manageChanges();
  }

  extendForm (initialData) {
    this.budgets = initialData.budgets ? initialData.budgets : [];
    this.initializeStartDate(initialData);
    this.initializeEndDate(initialData);
    this.initializeStartTimeField(initialData);
    this.initializeTimeZoneField(initialData);
  }

  private initializeStartDate(initialData: any): void {
    const startDate = initialData.startDate ? initialData.startDate.toDate() : '';
    this.form.addControl('startDate', new FormControl(startDate, Validators.required));
  }

  private initializeEndDate(initialData: any): void {
    const endDate = initialData.endDate ? initialData.endDate.toDate() : '';
    this.form.addControl('endDate', new FormControl(endDate, Validators.required));
  }

  private initializeStartTimeField(initialData: any): void {
    const isMinuteOrHour = this.isDurationUnitMinuteOrHour(this.opportunity.durationUnit);
    const startTime = initialData.startTime ? initialData.startTime.format('HH:mm') : undefined;
    const validators = isMinuteOrHour ? Validators.required : undefined;
    this.form.addControl('startTime', new FormControl(startTime, validators));
    this.updateTimePickerPlaceHolder(!isMinuteOrHour);
  }

  private isDurationUnitMinuteOrHour(value) {
    return [OpportunityDurationUnit.MINUTE, OpportunityDurationUnit.HOUR].includes(value);
  }

  private updateTimePickerPlaceHolder(opcional: boolean) {
    this.timePickerPlaceHolder = opcional
      ? `${this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.SOW.STEP_1.START_TIME_LABEL')}
        (${this.translateService.instant('COMMON.OPTIONAL')})`
      : this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.SOW.STEP_1.START_TIME_LABEL');
  }

  private initializeTimeZoneField(initialData: any): void {
    let timeZone = initialData.timeZone ? this.listTimeZones.find(tz => tz === initialData.timeZone) : undefined;
    this.user$.subscribe(user => {
      if (!timeZone) {
        timeZone = user.timezone || MomentTZ.tz.guess();
      }
    });
    this.form.addControl('timeZone', new FormControl(timeZone.replace(/_/g, ' '), Validators.required));
    this.filteredTZ$ = this.form.get('timeZone').valueChanges.pipe(
      startWith(null),
      map(name => this.filterTz(name))
    );
  }

  private filterTz(val: { timezone: string }): string[] {
    return val
      ? this.listTimeZones.filter(tz => new RegExp(`${val}`, 'gi').test(tz))
      : this.listTimeZones;
  }

  manageChanges() {
    this.subscription.add(this.form.get('startDate').valueChanges.subscribe(
      value => this.minValueForEndDate = MomentTZ.isMoment(value) ? value.toDate() : value
    ));
    this.subscription.add(this.form.get('durationUnit').valueChanges.subscribe(
      value => {
        const isMinuteOrHour = this.isDurationUnitMinuteOrHour(value);
        isMinuteOrHour
          ? this.form.get('startTime').setValidators(Validators.required)
          : this.form.get('startTime').setValidators(undefined);
        this.form.get('startTime').updateValueAndValidity();
        this.updateTimePickerPlaceHolder(!isMinuteOrHour);
      }
    ));
  }

  closeOverlay() {
    this.overlayRef.close();
  }

  private isValid() {
    return this.form.valid
      && this.paymentFieldsComponent.form.valid
      && this.modeFieldsComponent.form.valid;
  }

  onSubmit($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.isSubmitted = true;
    this.form.markAllAsTouched();
    if (this.isValid()) {
      this.applicant.sow = this.getDataToSend();
      this.nextPage.emit();
    } else {
      this.modeFieldsComponent.showLocationErrors();
      SetFocusOnInvalid(this.form, this.elRef);
    }
  }

  getDataToSend(): any {
    let data = this.service.getDataToSend();
    const starDate = data['startDate'];
    const endDate = data['endDate'];
    const startTime = data['startTime'];
    if (startTime && startTime instanceof Date) {
      data['startTime'] = startTime.toTimeString().split(' ')[0];
    }
    data['startDate'] = starDate.toISOString().split('T')[0];
    data['endDate'] = endDate.toISOString().split('T')[0];
    data['budgets'] = this.oppFieldSharedService.getBudgetsToSend(this.paymentFieldsComponent.form);
    const modeData = this.oppFieldSharedService.getDataToSendFromMode(this.modeFieldsComponent.form);
    data = {...data, ...modeData};
    this.getDataToSendFromTimeZone(data);
    return data;
  }

  private getDataToSendFromTimeZone(data) {
    data['timezone'] = data['timeZone'].replace(/ /g, '_');
    delete data['timeZone'];
  }

  durationUnitsOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
