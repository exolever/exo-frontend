import { Component, OnInit, Optional, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';

import { DATA } from '@core/modules/overlay/services/overlay.service';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { OverlayReference } from '@overlay/overlay-ref';
import {
  OpportunitiesFieldSharedService
} from '@shared/modules/opportunities-fields-shared/services/opportunities-fields-shared.service';
import { OpportunityTypePayment, AdvisoryCallDurationUnit } from '@opportunities/models/opportunity.enum';
import { positiveNumberValidator } from '@shared/custom-validations/positive-number-validator.directive';
import { AdvisoryCallSettingsInterface } from '@applications/workspace/projects/models/project.interface';
import { ProjectService } from '@applications/workspace/projects/services/project.service';
import {
  PaymentManagementComponent
} from '@shared/modules/opportunities-fields-shared/components/payment-management/payment-management.component';

interface DataInterface {
  title?: string;
  showFullScreen?: boolean;
  data?: {
    project: GenericProject;
    advisoryCallSettings: AdvisoryCallSettingsInterface
  };
}

@Component({
  selector: 'app-advisory-call-settings-dialog',
  templateUrl: './advisory-call-settings-dialog.component.html',
  styleUrls: ['./advisory-call-settings-dialog.component.scss']
})
export class AdvisoryCallSettingsDialogComponent implements OnInit, OnDestroy {
  @ViewChild(PaymentManagementComponent, {static: false}) paymentFieldsComponent: PaymentManagementComponent;
  project: GenericProject;
  typePayments = OpportunityTypePayment;
  form: FormGroup;
  subscription = new Subscription();
  durationUnits = AdvisoryCallDurationUnit;
  isSubmitted = false;
  budgets = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: DataInterface,
    @Optional() @Inject(DATA) public data: DataInterface,
    @Optional() private overlayRef: OverlayReference,
    @Optional() private dialogRef: MatDialogRef<AdvisoryCallSettingsDialogComponent>,
    private formBuilder: FormBuilder,
    public oppFieldSharedService: OpportunitiesFieldSharedService,
    private projectsService: ProjectService,
  ) { }

  ngOnInit() {
    this.dialogData = this.dialogData ? this.dialogData : this.data;
    this.project = this.dialogData.data.project;
    this.initializeForm();
  }

  initializeForm() {
    const advisoryCallSettings = this.dialogData.data.advisoryCallSettings;
    this.form = this.formBuilder.group({
      total: [
        advisoryCallSettings ? advisoryCallSettings.total : '',
        [Validators.required, positiveNumberValidator()]
      ],
      durationValue: [advisoryCallSettings ? advisoryCallSettings.durationValue : '', Validators.required],
      durationUnity: [advisoryCallSettings ? advisoryCallSettings.durationUnity : AdvisoryCallDurationUnit.HOUR],
    });
    this.budgets = advisoryCallSettings && advisoryCallSettings.budgets ? advisoryCallSettings.budgets : [];
  }


  onClose(data: AdvisoryCallSettingsInterface) {
    this.dialogRef ? this.dialogRef.close(data) : this.overlayRef.close(data);
  }

  onSave() {
    this.form.markAllAsTouched();
    this.isSubmitted = true;
    if (this.form.valid) {
      const budgetsToSend = this.oppFieldSharedService.getBudgetsToSend(this.paymentFieldsComponent.form);
      const dataToSend = {
        total: this.form.get('total').value,
        durationValue: this.form.get('durationValue').value,
        durationUnity: this.form.get('durationUnity').value,
        budgets: budgetsToSend
      };
      this.subscription.add(
        this.projectsService.changeAdvisoryCallSettings(dataToSend, this.project.pk).subscribe(
          () => this.onClose(dataToSend)
        )
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
