import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { UrlService, UserModel, Urls } from '@app/core';
import { Post } from '@forum/interfaces/post.interface';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedItemComponent implements OnDestroy {
  @Input() post: Post;
  @Input() user: UserModel;
  @Output() seeDetails: EventEmitter<number> = new EventEmitter();
  @Output() edit: EventEmitter<boolean> = new EventEmitter();
  @Output() delete: EventEmitter<boolean> = new EventEmitter();
  private subscription: Subscription;

  constructor (
    private router: Router,
    private urlService: UrlService
  ) { }

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

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
