import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Urls, UrlService, UserModel, UserService } from '@app/core';
import { AppState } from '@core/store/reducers';
import { VALIDATION_CONFIG } from '@core/config/validation-config';
import { messageHintErrorAnimation } from '@animations/message-hint-error.animation';

import * as opportunitiesActions from '../../store/actions/opportunities.action';
import { OpportunityModel } from '../../models/opportunity.model';

@Component({
  templateUrl: './opportunity-dialog-apply.component.html',
  styleUrls: ['./opportunity-dialog-apply.component.scss'],
  animations: [messageHintErrorAnimation]
})
export class OpportunityDialogApplyComponent implements OnInit, OnDestroy {
  form: FormGroup;
  userLogged: UserModel;
  privateUrl: string;
  maxLengthOpportunityApply = 2000;
  private subscriptions: Subscription[] = [];
  showQuestionsErrors = false;

  constructor(
    private fb: FormBuilder,
    private urlService: UrlService,
    @Inject(VALIDATION_CONFIG) public validationConfig,
    @Inject(MAT_DIALOG_DATA) public data: { opportunity: OpportunityModel, name: string },
    private userService: UserService,
    public dialogRef: MatDialogRef<OpportunityDialogApplyComponent>,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.user$.subscribe((user) => {
      this.userLogged = user;
      this.privateUrl = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_EDIT, this.userLogged.slug]);
    }));
    this.form = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(this.maxLengthOpportunityApply)]],
      questionsExtraInfo: ['', [Validators.maxLength(this.validationConfig.maxLength)]],
    });

    this.data.opportunity.questions.map(question => {
      this.form.addControl(question.id.toString(), new FormControl(undefined, Validators.required));
    });
  }

  editProfile() {
    window.open(this.privateUrl, '_blank');
  }

  buildDataToSend() {
    const data = { comment: this.form.get('comment').value };
    if (this.hasQuestions()) {
      const answers = [];
      this.data.opportunity.questions.map(question => {
        answers.push ({question: question.id.toString(), response: this.form.get(question.id.toString()).value});
      });
      data['questionsExtraInfo'] = this.form.get('questionsExtraInfo').value;
      data['answers'] = answers;
    }
    return data;
  }

  hasQuestions(): boolean {
    return this.data.opportunity.questions && this.data.opportunity.questions.length > 0;
  }

  submitApply() {
    this.form.controls.comment.markAsTouched();
    this.showQuestionsErrors = true;
    if (this.form.valid) {
      const dataToSend = this.buildDataToSend();
      this.store.dispatch(new opportunitiesActions.ApplyOpportunity({
        pkOpportunity: this.data.opportunity.pk,
        dataToSend
      }));
      this.dialogRef.close(true);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

}
