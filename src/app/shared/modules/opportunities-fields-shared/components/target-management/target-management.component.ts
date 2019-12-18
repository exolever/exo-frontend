import { Component, OnInit, ElementRef, ViewChild, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { OpportunityTarget } from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';
import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';
import {
  IEcosystemSearcherConsultantOptions
} from '@shared/modules/ecosystem-searcher/ecosystem-searcher-result.interface';
import {
  OpportunityApplicantModel
} from '@applications/ecosystem/modules/opportunities/models/opportunity-applicant.model';
import { ConsultantModel } from '@applications/shared/models';

@Component({
  selector: 'app-target-management',
  templateUrl: './target-management.component.html',
  styleUrls: ['./target-management.component.scss']
})
export class TargetManagementComponent implements OnInit, OnChanges, OnDestroy {
  @Input() opportunity: OpportunityModel;
  @ViewChild('sentTemplate', {static: true}) sentTplRef: ElementRef;
  @ViewChild('rejectedTemplate', {static: true}) rejectedTplRef: ElementRef;
  @ViewChild('selectedTemplate', {static: true}) selectedTplRef: ElementRef;
  target = OpportunityTarget;
  recipientsExtraOptions: IEcosystemSearcherConsultantOptions[] = [];
  private subscription = new Subscription();
  form = new FormGroup({});

  ngOnInit() {
    this.initializeTargetFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.opportunity && changes.opportunity.currentValue) {
      this.initializeTargetFields();
    }
  }

  manageChanges() {
    this.subscription.add(
      this.form.get('target').valueChanges.subscribe(value => {
        value === OpportunityTarget.TARGETED
          ? this.form.get('recipients').setValidators(Validators.required)
          : this.form.get('recipients').setValidators(null);
        this.form.get('recipients').updateValueAndValidity();

        value === OpportunityTarget.OPEN
          ? this.form.get('certification').setValidators(Validators.required)
          : this.form.get('certification').setValidators(null);
        this.form.get('certification').updateValueAndValidity();

      })
    );
  }

  initializeTargetFields(): void {
    const target = this.opportunity ? this.opportunity.target : OpportunityTarget.OPEN;
    const targetControl = new FormControl(
      target,
      target === OpportunityTarget.TARGETED ? Validators.required : undefined
    );

    this.form.get('target') ?
      this.form.setControl('target', targetControl) :
      this.form.addControl('target', targetControl);

    const consultants = target === OpportunityTarget.TARGETED
      ? this.opportunity.recipients
      : [];
    const consultantsControl = new FormControl(consultants);
    this.form.get('recipients') ?
      this.form.setControl('recipients', consultantsControl) :
      this.form.addControl('recipients', consultantsControl);

    this.recipientsExtraOptions = this.getRecipientsExtraOptions(consultants);
  }

  /**
   * Define the extra options for EcosystemSearcherComponent consultant items
   */
  private getRecipientsExtraOptions(recipients: any): IEcosystemSearcherConsultantOptions[] {
    // Just in case of editing
    if (this.opportunity) {
      return recipients.
        map(recipient => this.opportunity.applicants.find(applicant => applicant.user.uuid === recipient.uuid)).
        filter(applicant => applicant !== undefined).
        map(applicant => {
          return <IEcosystemSearcherConsultantOptions>{
            consultantPk: applicant.user.uuid,
            canBeDeleted:  false,
            template: this.getTemplate(applicant),
          };
      });
    }
    return [];
  }

  private getTemplate(applicant: OpportunityApplicantModel): ElementRef {
    if (applicant.isRequested()) { return this.sentTplRef; }
    if (applicant.isRejected()) { return this.rejectedTplRef; }
    if (applicant.isSelected() || applicant.isFeedbackInvolved() || applicant.isCompleted()) {
      return this.selectedTplRef;
    }
    return undefined;
  }


  onUpdateRecipients(consultants: Array<ConsultantModel>) {
    this.form.get('recipients').setValue(consultants);
    this.recipientsExtraOptions = this.getRecipientsExtraOptions(consultants);
  }

  isTargeted(): boolean {
    return this.form.get('target').value === OpportunityTarget.TARGETED;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
