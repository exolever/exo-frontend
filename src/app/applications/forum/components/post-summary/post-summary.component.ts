import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { UrlService, UserModel, Urls } from '@app/core';
import { Post } from '@forum/interfaces/post.interface';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';

@Component({
  selector: 'app-post-summary',
  templateUrl: './post-summary.component.html',
  styleUrls: ['./post-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostSummaryComponent extends ManageMatMenuComponent implements OnDestroy {
  @Input() post: Post;
  @Input() user: UserModel;
  @Input() showCardWrapper = true;
  @Output() seeDetails: EventEmitter<number> = new EventEmitter();
  @Output() edit: EventEmitter<boolean> = new EventEmitter();
  @Output() delete: EventEmitter<boolean> = new EventEmitter();
  private subscription: Subscription;

  constructor (
    private translate: TranslateService,
    private router: Router,
    private urlService: UrlService,
    private promptDialogService: PromptDialogService) {
      super();
    }

  showMenu(): boolean {
    return this.user && this.showCardWrapper && +this.post.createdBy.pk === +this.user.pk;
  }

  stopPropagation($event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  goToProfile($event): void {
    this.stopPropagation($event);
    const url = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_VIEW, this.post.createdBy.slug]);
    this.router.navigate([url]);
  }

  hasNewAnswers(): boolean {
    return this.post.answersUnseen > 0;
  }

  isNew(): boolean {
    return this.post.answersUnseen === this.post.answers;
  }

  editEmit($event) {
    this.edit.emit($event);
  }

  deleteConfirmation($event) {
    this.subscription = this.promptDialogService.open({
      title: this.translate.instant('FORUM.DELETE_TITLE'),
      secondaryButton: this.translate.instant('FORUM.CANCEL'),
      primaryButton: this.translate.instant('FORUM.DELETE')
    }).pipe(
      filter((result) => result === true),
      tap(() => this.delete.next($event))
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
