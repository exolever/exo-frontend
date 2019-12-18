import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import * as filestack from 'filestack-js';
import { TranslateService } from '@ngx-translate/core';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { KeywordModel } from '@applications/shared/models';
import { KeywordService } from '@applications/shared/services';
import { environment } from '@environments/environment';
import { VALIDATION_CONFIG } from '@core/config/validation-config';
import { Circle } from '@applications/circles/models/circle.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-circles-form',
  templateUrl: './circles-form.component.html',
  styleUrls: ['./circles-form.component.scss']
})
export class CirclesFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  allKeywords: Observable<KeywordModel[]>;
  keywordModel = KeywordModel;
  subscriptions = new Subscription();
  @Input() circle: Circle;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Circle> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private keywordsService: KeywordService,
    private translate: TranslateService,
    private promptDialogService: PromptDialogService,
    @Inject(VALIDATION_CONFIG) public validationConfig
  ) { }

  ngOnInit() {
    this.allKeywords = this.keywordsService.getKeywords();

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(this.validationConfig.maxLength)]],
      description: ['', [Validators.required, Validators.maxLength(this.validationConfig.maxLength)]],
      image: [],
      tags: [[]]
    });

    if (this.circle) {
      this.form.patchValue({
        name: this.circle.name,
        description: this.circle.description,
        tags: this.circle.tags,
        image: {
          url: this.circle.image,
          filestack_status: 'Stored',
          filename: 'default_circle.png',
          mimetype: 'image/png'
        }
      });
    }
  }

  getAvatar(): string {
    return this.form.get('image').value ? this.form.get('image').value.url : '/assets/images/default_circle.png';
  }

  uploadFile() {
    const setUpFilepicker = {
      accept: 'image/*',
      maxSize: (10 * 1024 * 1024),
      dropPane: {},
      onUploadDone: file => this.form.get('image').setValue({
        filestack_status: file.filesUploaded[0].status,
        url: file.filesUploaded[0].url,
        filename: file.filesUploaded[0].filename,
        mimetype: file.filesUploaded[0].mimetype
      })
    };

    filestack.init(environment.FILESTACK_API_KEY).picker(setUpFilepicker).open();
  }

  onCancel() {
    if (this.form.dirty) {
      this.subscriptions.add(
        this.promptDialogService.open({
          title: this.translate.instant('FORUM.LEAVE_POST_FORM'),
          messages: [this.translate.instant('FORUM.LOSE_CHANGES')],
          secondaryButton: this.translate.instant('FORUM.LEAVE'),
          primaryButton: this.translate.instant('FORUM.STAY')
        }).pipe(
          filter((result) => result === false)
        ).subscribe(() => this.cancel.emit()));
    } else {
      this.cancel.emit();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.getRawValue();
      data['image'] = data['image'] ? data['image'] : {
        url: '/assets/images/default_circle.png',
        filestack_status: 'Stored',
        filename: 'default_circle.png',
        mimetype: 'image/png'
      };
      this.save.emit(data);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
