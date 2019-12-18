import { Component, Inject, OnInit } from '@angular/core';

import { OverlayReference } from '@overlay/overlay-ref';
import { DATA } from '@overlay/services/overlay.service';

import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';
import {
  OpportunityApplicantModel
} from '@applications/ecosystem/modules/opportunities/models/opportunity-applicant.model';

@Component({
  selector: 'app-sow-container.component',
  templateUrl: './sow-container.component.html',
  styleUrls: ['./sow-container.component.scss']
})
export class SowContainerComponent implements OnInit {
  activeStep = 1;
  opportunity: OpportunityModel;
  applicant: OpportunityApplicantModel;
  isEditing: boolean;
  constructor(
    private overlayRef: OverlayReference,
    @Inject(DATA) public data: any
    ) { }

  ngOnInit () {
    this.opportunity = this.data.opportunity;
    this.applicant = this.data.applicant;
    this.isEditing = this.data.isEditing;
  }

  nextPage() {
    if (this.activeStep < 2) {
      this.activeStep++;
    }
  }

  prevPage() {
    if (this.activeStep > 1) {
      this.activeStep--;
    }
  }

  closeOverlay() {
    this.applicant.sow = undefined; // Clean the information no saved yet
    this.overlayRef.close();
  }

}
