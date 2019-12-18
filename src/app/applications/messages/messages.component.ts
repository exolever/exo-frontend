import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';

import { itemListAnimation } from '@animations/item-list.animation';
import { UserModel } from '@core/models/user/user.model';
import { Urls, UrlService } from '@core/services';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';

import { PersistentMessageModel } from './models/persistent-message.model';
import { LevelEnum } from './enums/message-level.enum';

import {
  PersistentMessageCodeEnum,
  PersistentMessageActionEnum
} from './enums';
import { MessageService } from './messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [itemListAnimation]
})
export class MessageComponent implements OnInit, OnDestroy {
  private user: UserModel;
  private subscriptions: Array<Subscription> = [];

  public levelEnum = LevelEnum;
  public persistentMessageActionEnum = PersistentMessageActionEnum;
  public persistentMessageCodeEnum = PersistentMessageCodeEnum;
  public userPersistentMessagesList: Array<PersistentMessageModel> = [];

  constructor(
    private mdSnackBar: MatSnackBar,
    private messageService: MessageService,
    private urlService: UrlService,
    private router: Router,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select((state) => fromUser.getUser(state))).subscribe(user => this.user = user)
    );

    this.getMessages();
    this.subscribeChannelMessages();
  }

  getMessages(): void {
    this.subscriptions.push(
      this.messageService.getMessages().subscribe(res => {
        if (this.needRefreshMessages(res)) {
          this.userPersistentMessagesList = res;
        }
      })
    );
  }

  needRefreshMessages(newMessageList: Array<PersistentMessageModel>): boolean {
    const haveDifferentLength =
      this.userPersistentMessagesList.length === newMessageList.length;
    let needRefreshMessage = true;
    let messageListContainsElement: boolean;

    if (haveDifferentLength) {
      newMessageList.forEach(el => {
        messageListContainsElement =
          this.userPersistentMessagesList.find(msg => msg.pk === el.pk) !==
          undefined;
        if (messageListContainsElement) {
          needRefreshMessage = false;
        }
      });
    }

    return needRefreshMessage;
  }

  subscribeChannelMessages(): void {
    this.subscriptions.push(
      this.messageService.getMessagesList$().subscribe(() => this.getMessages())
    );
  }

  sendAction(action: string, msg: PersistentMessageModel, canDelete: boolean, successInfo?: string): void {
    this.subscriptions.push(
      this.messageService.sendAction(action, msg).subscribe(() => {
          if (canDelete) {
            this.userPersistentMessagesList = this.userPersistentMessagesList.filter(obj => obj.pk !== msg.pk);
          }
          if (successInfo) {
            this.mdSnackBar.open(this.translate.instant(successInfo), this.translate.instant('NOTIFICATION.CLOSE'));
          }
        }
      )
    );
  }

  navigateToAccountSettings(): void {
    const url = this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_ACCOUNT, this.user.pk]);
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
}

