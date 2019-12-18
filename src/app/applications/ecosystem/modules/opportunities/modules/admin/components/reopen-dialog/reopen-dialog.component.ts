import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

import * as MomentTZ from 'moment-timezone';
import { Store } from '@ngrx/store';

import { convertDateToString } from '@shared/helpers/md2Datepicker.helper';
import { AppState } from '@core/store/reducers';
import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';

import * as opportunitiesAdminActions from '../../store/actions/opportunities-admin.action';

@Component({
  templateUrl: './reopen-dialog.component.html',
  styleUrls: ['./reopen-dialog.component.scss']
})
export class ReopenDialogComponent {

  deadline: FormControl;
  // Define tomorrow as a default day for deadline
  tomorrow = MomentTZ().utc().add(1, 'days').toDate();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { opportunity: OpportunityModel },
    private dialogRef: MatDialogRef<ReopenDialogComponent>,
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.deadline = this.formBuilder.control(this.tomorrow, Validators.required);
  }

  onSubmit() {
    const deadlineToSend = convertDateToString(this.deadline.value);
    this.store.dispatch(new opportunitiesAdminActions.ReopenOpportunity(
        { pk: this.data.opportunity.pk, deadline: deadlineToSend } ));
    this.dialogRef.close();
  }

}
