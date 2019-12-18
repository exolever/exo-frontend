import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { positiveNumberValidator } from '@shared/custom-validations/';
import { ShowErrors } from '@shared/utils/form';
import { FILESTACK_SUCCESS_STATUS } from '@core/services/filestack.service';

import { SowInterface } from '../../models/opportunity.interface';
import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunityDurationUnit } from '../../models/opportunity.enum';

@Injectable()
export class ManagementOpportunityFormService {
  form: FormGroup;
  maxLengthForTitleEntity = 200;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  populateForm(data: OpportunityModel | SowInterface) {
    const title = data ? data.hasOwnProperty('title') ? (data as any).title : (data as any).subject : '';
    this.form.get('title').setValue(title);
    this.form.get('entity').setValue(data ? data.entity : '');
    this.form.get('description').setValue(data ? data.description : '');
    this.form.get('relatedEntity').disable();
    this.initializeDurationFields(data);
    this.initializeFiles(data);
  }

  initializeForm(data: OpportunityModel | SowInterface) {
    // It's the same field: in the opportunity model is subject but in the sow interface is title
    const title = data ? data.hasOwnProperty('title') ? (data as any).title : (data as any).subject : '';
    this.form = this.formBuilder.group({
      title: [
        title,
        [Validators.required, Validators.maxLength(this.maxLengthForTitleEntity)]
      ],
      entity: [
        data ? data.entity : '',
        // Optional field
        Validators.maxLength(this.maxLengthForTitleEntity)
      ],
      description: [
        data ? data.description : '',
        Validators.required
      ],
      relatedEntity: []
    });
    this.initializeDurationFields(data);
    this.initializeFiles(data);
  }

  initializeFiles(data: OpportunityModel | SowInterface): void {

    const files = data && data.files ? data.files.map(file => {
        return  {
          filename: file.name,
          mimetype: file.mimetype,
          url: file.link,
          filestackStatus: FILESTACK_SUCCESS_STATUS
        };
      }) : [];
    const fileControl = new FormControl(files);
    this.form.get('files') ?
      this.form.setControl('files', fileControl) :
      this.form.addControl('files', fileControl);
  }

  initializeDurationFields(data: OpportunityModel | SowInterface): void {
    const durationValidators = data instanceof SowInterface
      ? [Validators.required, positiveNumberValidator()]
      : [positiveNumberValidator()];

    const durationControl = new FormControl(data ? data.duration : '', durationValidators);
    this.form.get('duration') ?
      this.form.setControl('duration', durationControl) :
      this.form.addControl('duration', durationControl);

    const unit = data
      ? data.durationUnit ? data.durationUnit : OpportunityDurationUnit.HOUR
      : OpportunityDurationUnit.HOUR;
    const validators = data instanceof SowInterface ? [Validators.required] : [];
    const durationUnitControl = new FormControl(unit, validators);
    this.form.get('durationUnit') ?
      this.form.setControl('durationUnit', durationUnitControl) :
      this.form.addControl('durationUnit', durationUnitControl );
  }

  getDataToSend() {
    const data = this.form.getRawValue();
    this.getDataToSendFromDuration(data);
    return data;
  }

  private getDataToSendFromDuration(data: any): void {
    if (this.form.get('duration').value) {
      data['durationValue'] = this.form.get('duration').value;
    }
    data['durationUnity'] = this.form.get('durationUnit').value;
    delete data['duration'];
    delete data['durationUnit'];
  }

  showErrors(field: string, isSubmitted: boolean): boolean {
    return ShowErrors(isSubmitted, this.form, field);
  }

}
