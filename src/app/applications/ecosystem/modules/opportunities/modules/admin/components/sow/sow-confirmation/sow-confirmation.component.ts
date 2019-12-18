import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Store } from '@ngrx/store';

import { OverlayReference } from '@overlay/overlay-ref';
import { AppState } from '@core/store/reducers';
import {
  OpportunityApplicantModel
} from '@applications/ecosystem/modules/opportunities/models/opportunity-applicant.model';
import * as opportunitiesAdminActions from '../../../store/actions/opportunities-admin.action';

@Component({
  selector: 'app-sow-confirmation',
  templateUrl: './sow-confirmation.component.html'
})
export class SowConfirmationComponent {
  @Output() prevPage: EventEmitter<any> = new EventEmitter();
  @Input() applicant: OpportunityApplicantModel;
  @Input() isEditing: boolean;
  message = new FormControl();

  constructor(
    private store: Store<AppState>,
    private overlayRef: OverlayReference
  ) {}

  preview() {
    this.prevPage.emit();
  }

  closeOverlay() {
    this.applicant.sow = undefined; // Clean the information no saved yet
    this.overlayRef.close();
  }

  save() {
    const sowData = this.applicant.sow;
    if (this.isEditing) {
      this.store.dispatch(new opportunitiesAdminActions.EditSow(
        {applicant: this.applicant, sow: sowData, message: this.message.value}
      ));
    } else {
      this.store.dispatch(new opportunitiesAdminActions.OpportunitySelectAplicant(
        {applicant: this.applicant, sow: sowData, message: this.message.value}
      ));
    }
    this.closeOverlay();
  }
}
