import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OverlayReference } from '@overlay/overlay-ref';
import { DATA } from '@overlay/services/overlay.service';
import {
  OpportunitiesFeedbackService, FeedbackStatus
} from '@opportunities/shared/services/opportunities-feedback.service';
import { MatSnackBar } from '@angular/material';
import { SNACK_BAR_CONFIG } from '@profile-edition/profile-edition.conf';
import { TranslateService } from '@ngx-translate/core';
import { OpportunitiesSerializerService } from '@opportunities/shared/services/opportunities-serializer.service';

@Component({
  selector: 'app-opportunity-feedback-dialog',
  templateUrl: './opportunity-feedback-dialog.component.html',
  styleUrls: ['./opportunity-feedback-dialog.component.scss']
})
export class OpportunityFeedbackDialogComponent implements OnInit {

  form: FormGroup;
  enumStatus = FeedbackStatus;
  maxLevel = 10;

  constructor(
    private overlayRef: OverlayReference,
    private fb: FormBuilder,
    private feedbackService: OpportunitiesFeedbackService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private opportunitiesSerializerService: OpportunitiesSerializerService,
    @Inject(DATA) public data: any,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      explained: ['', Validators.required],
      collaboration: ['', Validators.required],
      communication: ['', Validators.required],
      comment: [''],
      recommendation: [this.maxLevel, Validators.required],
    });

    if (this.data.showStatus) {
      this.form.addControl('status', new FormControl([this.enumStatus.Successful, Validators.required]));
      this.form.addControl('statusInfo', new FormControl(['']));
    }
  }

  closeOverlay(data?: any) {
    this.overlayRef.close(data);
  }

  onCancel() {
    this.closeOverlay();
  }

  onSubmit() {
    if (this.form.valid) {

      if (this.form.get('status') && this.form.get('status').value === this.enumStatus.Uncompleted
        && this.form.get('statusInfo').value === '') {
        this.form.get('statusInfo').setErrors({'required': true});
        this.form.get('statusInfo').markAsTouched();
        return;
      }

      this.feedbackService.submitFeedback(this.form.value, this.data.feedback.idApplicant).subscribe(res => {
        // Show snackbar
        this.snackBar.open(
          this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.SENT'),
          this.translateService.instant('NOTIFICATION.CLOSE'),
          SNACK_BAR_CONFIG
        );
        this.closeOverlay(this.opportunitiesSerializerService.serializeOpportunities(res));
      });
    }
  }

}
