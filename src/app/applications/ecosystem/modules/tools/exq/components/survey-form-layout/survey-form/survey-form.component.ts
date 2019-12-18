import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { select, Store } from '@ngrx/store';
import * as MomentTZ from 'moment-timezone';
import { Subscription } from 'rxjs';

import { AppState } from '@core/store/reducers';
import { Survey } from '@ecosystem/modules/tools/exq/store/exq.model';
import * as actions from '@ecosystem/modules/tools/exq/store/exq.action';
import * as errorActions from '@core/store/error/error.action';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
})
export class SurveyFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() survey: Survey;
  form: FormGroup;
  isSubmitted = false;
  today = MomentTZ().toDate();
  formNameChangeSubscription: Subscription;
  error: any;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private location: Location,
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      language: ['en', Validators.required],
      sendResults: [false, Validators.required],
      showResults: [false, Validators.required],
    });
  }

  ngOnInit() {
    this.formNameChangeSubscription = this.subscriptions.add(
      this.form.get('name').valueChanges.subscribe(
        () => this.form.get('slug').setValue(this.form.get('name').value.replace(/ /g, '-').toLowerCase())
      )
    );
    this.subscriptions.add(
      this.store.pipe(select('error')).subscribe(err => {
        if (err) {
          Object.keys(err).map(key => {
            this.form.controls[key].setErrors({ 'invalid': true });
            this.form.controls[key].markAsTouched();
          });
          this.error = err;
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const current = changes.survey.currentValue;
    if (current) {
      if (this.formNameChangeSubscription) {
        this.formNameChangeSubscription.unsubscribe();
      }
      this.form.patchValue(current);
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const data: Survey = this.form.getRawValue();
      if (this.survey) {
        const action = new actions.UpdateSurvey({ pk: this.survey.pk, data: data });
        this.store.dispatch(action);
      } else {
        const action = new actions.AddSurvey(data);
        this.store.dispatch(action);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.location.back();
  }

  onClose() {
    const d = new Date(this.form.get('end').value).toLocaleDateString();
    this.form.patchValue({ end: d });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.store.dispatch(new errorActions.ClearStore());
  }

  getDomain() {
    return this.survey ? this.survey.publicUrl.replace(this.survey.slug, '') : environment['exoPublicExQBaseUrl'];
  }
}
