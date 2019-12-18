import { Component, OnInit, Input, Inject, Output,
  EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { messageHintErrorAnimation } from '@animations/message-hint-error.animation';
import { IGooglePlace } from '@shared/directives/google-places/google-place.interface';
import { ShowErrors } from '@shared/utils/form';
import { VALIDATION_CONFIG } from '@core/config/validation-config';
import { UrlService, Urls } from '@core/services';
import { IValidationForm } from '@shared/utils/form.interface';

import { GenericProject } from '../../../models/project.model';
import { GenericDataInterface } from '../../../models/project.interface';


@Component({
  selector: 'app-project-general-form',
  templateUrl: './general-form.component.html',
  animations: [messageHintErrorAnimation]
})
export class GeneralFormComponent implements IValidationForm, OnInit, OnChanges, OnDestroy {
  @Input() project: GenericProject;
  @Output() dataToSave: EventEmitter<GenericDataInterface> = new EventEmitter();
  @Output() changeDataForm: EventEmitter<FormGroup> = new EventEmitter();
  subscription = new Subscription();
  subscriptAnimationState = 'enter';
  isSubmitted = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.validationConfig.maxLength)]],
    customer: ['', [Validators.maxLength(this.validationConfig.maxLength)]],
    description: ['', [Validators.maxLength(this.validationConfig.maxTextAreaLength)]],
    location: ['', Validators.required],
    placeId: ['', Validators.required],
    start: [undefined, Validators.required]
  });

  constructor(
    @Inject(VALIDATION_CONFIG) public validationConfig,
    private fb: FormBuilder,
    private router: Router,
    private urlService: UrlService,
  ) { }

  ngOnInit() {
    this.subscription.add(this.form.valueChanges.subscribe(
      value => this.changeDataForm.emit(this.form)
    ));
  }

  ngOnChanges(changes: SimpleChanges) {
    const project = changes.project.currentValue;
    if (project) {
      this.form.patchValue(project, { emitEvent: false });
    }
  }

   // onSelect event emitter Google Place location.
   setLocation(addrObj: IGooglePlace) {
    this.form.get('location').setValue(addrObj.name);
    this.form.get('placeId').setValue(addrObj.placeId);
    this.showLocationErrors();
  }

  showLocationErrors() {
    if (this.form.get('placeId').errors) {
      this.form.get('location').setErrors({ 'autoCompleteValidator': true });
      this.form.get('location').markAsTouched();
    }
  }

  showErrors(field): boolean {
    return ShowErrors(this.isSubmitted, this.form, field);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const dataForm = this.form.getRawValue();
      const data = this.project && this.project.pk ? {...dataForm, ...{pk: this.project.pk}} : dataForm;
      this.dataToSave.next(data);
    }
  }

  goToProjectList() {
    this.router.navigate([this.urlService.getPath([Urls.ECOSYSTEM_WORKSPACE_PROJECTS])]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
