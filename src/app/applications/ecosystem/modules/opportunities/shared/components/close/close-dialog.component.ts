import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Store } from '@ngrx/store';

import { DATA } from '@overlay/services/overlay.service';
import { OverlayReference } from '@overlay/overlay-ref';
import { AppState } from '@core/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';

import * as opportunitiesAdminActions from '../../../modules/admin/store/actions/opportunities-admin.action';

@Component({
  templateUrl: './close-dialog.component.html',
})
export class CloseDialogComponent {

  message: FormControl;

  constructor(
    @Optional() @Inject(DATA) public data: { opportunity: OpportunityModel, showFullScreen: boolean, title?: string },
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData:
      { opportunity: OpportunityModel, showFullScreen: boolean, title?: string },
    @Optional() private overlayRef: OverlayReference,
    @Optional() private dialogRef: MatDialogRef<CloseDialogComponent>,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    if (this.dialogData) {
      this.data = this.dialogData;
    }
    this.message = this.fb.control('');
  }

  submit() {
    if (this.message.value.trim()) {
      this.store.dispatch(new opportunitiesAdminActions.CloseOpportunity(
        { pk: this.data.opportunity.pk, message: this.message.value } ));
    } else {
      this.store.dispatch(new opportunitiesAdminActions.CloseOpportunity(
        { pk: this.data.opportunity.pk } ));
    }
    this.closeOverlay();
  }

  closeOverlay() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.overlayRef.close();
    }
  }

}
