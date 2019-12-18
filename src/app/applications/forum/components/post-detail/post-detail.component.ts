import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { UserModel, Urls, UrlService } from '@app/core';
import { Post } from '@forum/interfaces/post.interface';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDetailComponent extends ManageMatMenuComponent implements OnDestroy {
  @Input() title: string;
  @Input() post: Post;
  @Input() user: UserModel;
  @Output() edit: EventEmitter<boolean> = new EventEmitter();
  @Output() delete: EventEmitter<boolean> = new EventEmitter();
  @Output() favorite: EventEmitter<boolean> = new EventEmitter();

  private subscription: Subscription;

  constructor (
    private translate: TranslateService,
    private router: Router,
    private urlService: UrlService,
    private promptDialogService: PromptDialogService) {
      super();
    }

  showMenu(): boolean {
    return +this.post.createdBy.pk === +this.user.pk;
  }

  editEmit($event) {
    this.edit.emit($event);
  }

  goToProfile($event): void {
    this.stopPropagation($event);
    const url = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_VIEW, this.post.createdBy.slug]);
    this.router.navigate([url]);
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

  onFavorite() {
    this.favorite.emit(!this.post.liked);
  }

  getFavoriteColor() {
    return this.post.liked ? 'warn' : 'accent';
  }

  getFavoriteTooltip() {
    return this.post.liked ? this.translate.instant('COMMON.UNLIKE') : this.translate.instant('COMMON.LIKE');
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
