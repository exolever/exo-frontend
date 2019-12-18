import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { UserModel } from '@app/core';
import { VALIDATION_CONFIG } from '@core/config/validation-config';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';

import { KeywordModel } from '@applications/shared/models';
import { KeywordService } from '@applications/shared/services';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { FilestackService } from '@core/services/filestack.service';


@Component({
  selector: 'app-write-comment',
  templateUrl: './write-comment.component.html',
  styleUrls: ['./write-comment.component.scss']
})
export class WriteCommentComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;
  @Input() titleLabel: string;
  @Input() titleContent: string;
  @Input() commentLabel: string;
  @Input() commentContent: string;
  @Input() tagsLabel: string;
  @Input() tagsHint: string;
  @Input() tagsContent: KeywordModel[];
  @Input() resources: Array<FilestackUploadInterface> = [];
  @Input() saveButton: string;
  @Input() cancelButton: string;
  @Input() hideCancelConfirmation: boolean;
  @Input() mentionsAPI: string;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() cancelled: EventEmitter<boolean> = new EventEmitter();

  form: FormGroup;
  allKeywords: Observable<KeywordModel[]>;
  keywordModel = KeywordModel;
  subscriptions: Subscription[] = [];
  isSubmitted = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private promptDialogService: PromptDialogService,
    private keywordsService: KeywordService,
    @Inject(VALIDATION_CONFIG) public validationConfig,
  ) { }

  ngOnInit() {
    this.allKeywords = this.keywordsService.getKeywords();
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      comment: ['', Validators.required],
      tags: [[]],
    });
    if (this.titleLabel) {
      this.form.addControl('title', new FormControl('', [
        Validators.required,
        Validators.maxLength(this.validationConfig.maxLength)
      ]));
    }

    if (this.titleContent) {
      this.form.get('title').setValue(this.titleContent);
    }

    if (this.commentContent) {
      this.form.get('comment').setValue(this.commentContent);
    }

    if (this.tagsContent) {
      this.form.get('tags').setValue(this.tagsContent);
    }
  }

  onNewUpload(file) {
    this.resources.push(FilestackService.buildUploadedObject(file));
  }

  onCancel() {
    if (this.form.dirty && !this.hideCancelConfirmation) {
      this.subscriptions.push(
        this.promptDialogService.open({
          title: this.translate.instant('FORUM.LEAVE_POST_FORM'),
          messages: [this.translate.instant('FORUM.LOSE_CHANGES')],
          secondaryButton: this.translate.instant('FORUM.LEAVE'),
          primaryButton: this.translate.instant('FORUM.STAY')
        }).pipe(
          filter((result) => result === false),
          tap(() => this.cancelled.next(true))
        ).subscribe()
      );
    } else {
      this.cancelled.next(true);
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    const data = this.form.getRawValue();
    if (this.form.valid) {
      data['description'] = data['comment'];
      data['uploadedFiles'] = this.resources;
      this.saved.emit(data);
      this.resources = [];
      this.form.reset();
      this.form.markAsUntouched();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
