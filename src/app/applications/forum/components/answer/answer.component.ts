import {
  Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UserModel, Urls, UrlService } from '@app/core';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { Answer } from '@forum/interfaces/answer.interface';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnswerComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {
  @Input() answer: Answer;
  @Input() user: UserModel;
  @Input() canBeVoted: boolean;
  @Input() editionMode: boolean;
  @Input() mentionsAPI: string;
  @Output() rating: EventEmitter<number> = new EventEmitter();
  @Output() edit: EventEmitter<Answer> = new EventEmitter();
  @Output() delete: EventEmitter<boolean> = new EventEmitter();
  @Output() favorite: EventEmitter<boolean> = new EventEmitter();
  form: FormGroup;
  private subscription: Subscription;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private urlService: UrlService,
    private promptDialogService: PromptDialogService,
    private fb: FormBuilder) {
      super();
    }

  ngOnInit() {
    this.form = this.fb.group({
      comment: [this.answer.comment, Validators.required]
    });
  }

  enableEditionMode() {
    this.editionMode = true;
  }

  disableEditionMode() {
    this.editionMode = false;
  }

  deleteConfirmation($event) {
    this.promptDialogService.open({
      title: this.translate.instant('FORUM.DELETE_TITLE_ANSWER'),
      secondaryButton: this.translate.instant('FORUM.CANCEL'),
      primaryButton: this.translate.instant('FORUM.DELETE')
    }).pipe(
      filter((result) => result === true),
      tap(() => this.delete.next($event))
    ).subscribe();
  }

  showMenu(): boolean {
    return +this.answer.createdBy.pk === +this.user.pk;
  }

  onVoted(data) {
    this.rating.emit(data);
  }

  onEdited(data) {
    this.edit.emit(Object.assign(this.answer, data));
  }

  onFavorite() {
    this.favorite.emit(!this.answer.liked);
  }

  getFavoriteColor() {
    return this.answer.liked ? 'warn' : 'accent';
  }

  stopPropagation($event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  goToProfile($event): void {
    this.stopPropagation($event);
    const url = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_VIEW, this.answer.createdBy.slug]);
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
