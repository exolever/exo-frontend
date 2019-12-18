import { Component, Inject, ChangeDetectionStrategy, Optional, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { OverlayReference } from '@overlay/overlay-ref';
import { DATA } from '@overlay/services/overlay.service';
import { OpportunityApplicantModel } from '@opportunities/models/opportunity-applicant.model';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import {
  OpportunitiesManageActionsService
} from '@opportunities/modules/admin/service/opportunies-manage-actions.service';

interface DataInterface {
  title?: string;
  showFullScreen?: boolean;
  showChat?: boolean;
  data?: {
    applicant: OpportunityApplicantModel;
    opportunity: OpportunityModel;
  };
}

@Component({
  templateUrl: './applicant-detail-dialog.component.html',
  styleUrls: ['./applicant-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDetailDialogComponent implements OnInit {
  applicant: OpportunityApplicantModel;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: DataInterface,
    @Optional() @Inject(DATA) public data: DataInterface,
    @Optional() private overlayRef: OverlayReference,
    @Optional() private dialogRef: MatDialogRef<ApplicantDetailDialogComponent>,
    private manageActionsService: OpportunitiesManageActionsService
  ) { }

  ngOnInit() {
    this.dialogData = this.dialogData ? this.dialogData : this.data;
    this.applicant = this.dialogData.data.applicant;
  }

  openSow(isEditing: boolean) {
    this.closeOverlay();
    this.manageActionsService.openSow(this.dialogData.data.applicant, this.dialogData.data.opportunity, isEditing);
  }

  hasAnswers() {
    return this.dialogData.data.applicant.answers && this.dialogData.data.applicant.answers.length > 0;
  }

  closeOverlay(goToConversation = false) {
    this.dialogRef ? this.dialogRef.close(goToConversation) : this.overlayRef.close(goToConversation);
  }

}
