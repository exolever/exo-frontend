import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Event } from '@ecosystem/modules/events/store/event.model';
import { StatusTypeEnum } from '@ecosystem/modules/events/store/event.enums';
import { filter } from 'rxjs/operators';
import { PromptDataInterface } from '@shared/modules/prompt-dialog/prompt-dialog.interface';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EventService } from '@ecosystem/modules/events/service/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-events-card-preview',
  templateUrl: './events-card-preview.component.html',
  styleUrls: ['./events-card-preview.component.scss']
})
export class EventsCardPreviewComponent implements OnChanges, OnDestroy {
  @Input() event: Event;
  @Input() isReviewer: boolean;
  statusTypeEnum = StatusTypeEnum;
  closeLabel: string;
  private subscriptions = new Subscription();

  constructor(private promptDialogService: PromptDialogService,
              private translate: TranslateService,
              private snackBar: MatSnackBar,
              private eventsService: EventService) {
    this.closeLabel = this.translate.instant('NOTIFICATION.CLOSE');
  }

  ngOnChanges(prev) {
    if (prev.event.currentValue) {
      this.event = prev.event.currentValue;
    }
  }

  getFirstParticipant() {
    return (this.event.participants && this.event.participants.length) ? this.event.participants[0] : undefined;
  }

  onClickAction(action: StatusTypeEnum) {
    const config = this.configDialog(action);
    this.subscriptions.add(
      this.promptDialogService.open(config).pipe(filter(res => res !== false)).subscribe(res => {
        const data = { comment: typeof (res) === 'string' ? res : '' };
        if (action === StatusTypeEnum.PUBLIC) {
          this.subscriptions.add(
            this.eventsService.publishEvent(this.event.uuid, data).subscribe((r: any) => {
              if (r.Status === StatusTypeEnum.PUBLIC) {
                this.snackBar.open(this.translate.instant('ECOSYSTEM.EVENTS.TOAST.PUBLISHED'), this.closeLabel);
              }
            })
          );
        }
        if (action === StatusTypeEnum.REJECTED) {
          this.subscriptions.add(
            this.eventsService.rejectEvent(this.event.uuid, data).subscribe((r: any) => {
              if (r.Status === StatusTypeEnum.REJECTED) {
                this.snackBar.open(this.translate.instant('ECOSYSTEM.EVENTS.TOAST.REJECTED'), this.closeLabel);
              }
            })
          );
        }
      })
    );
  }

  goToSite() {
    const url = this.event.url;
    if (url.length) {
      window.open(url, '_blank');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private configDialog(action: StatusTypeEnum) {
    let messages: string[];
    let title = '';

    switch ( action ) {
      case StatusTypeEnum.REJECTED:
        messages = [this.translate.instant('ECOSYSTEM.EVENTS.PREVIEW_CARD.DISCARD_MESSAGE')];
        title = this.translate.instant('ECOSYSTEM.EVENTS.PREVIEW_CARD.DISCARD_TITLE');
        break;
      case StatusTypeEnum.PUBLIC:
        messages = [this.translate.instant('ECOSYSTEM.EVENTS.PREVIEW_CARD.PUBLISH_MESSAGE')];
        title = this.translate.instant('ECOSYSTEM.EVENTS.PREVIEW_CARD.PUBLISH_TITLE');
        break;
    }
    const config: PromptDataInterface = {
      title: title,
      messages: messages,
      primaryButton: this.translate.instant(
        action === StatusTypeEnum.REJECTED ? 'ECOSYSTEM.EVENTS.PREVIEW_CARD.REJECT'
          : 'ECOSYSTEM.EVENTS.PREVIEW_CARD.PUBLISH'),
      secondaryButton: this.translate.instant('COMMON.CANCEL'),
      textArea: {
        placeholder: this.translate.instant(
          action === StatusTypeEnum.REJECTED ? 'ECOSYSTEM.EVENTS.PREVIEW_CARD.COMMENT'
            : 'ECOSYSTEM.EVENTS.PREVIEW_CARD.COMMENT_OPT'),
        isRequired: action === StatusTypeEnum.REJECTED
      }
    };

    return config;
  }
}
