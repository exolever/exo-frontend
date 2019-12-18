import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core/';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { getValueEnum } from '../../shared/helpers/enum.helper';
import { getPublicMessage, PublicMessageStatusEnum } from '../shared/public-messages.functions';


export class ShowAlertMessage implements OnInit, OnDestroy {
  protected queryParamsSubscription: Subscription;
  private statusMessage: PublicMessageStatusEnum;
  private messageCode: string;
  userMessage: string;
  showAlert = false;

  constructor(
    protected route: ActivatedRoute,
    protected translate: TranslateService
  ) { }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      if (params.code) {
        this.statusMessage = getValueEnum(PublicMessageStatusEnum, params.code);
        this.messageCode = params.message;
        this.userMessage = this.getAlertMessage();
        this.showAlert = this.userMessage !== undefined;
      }
    });
  }

  getAlertMessage(): string {
    return this.translate.instant(getPublicMessage(this.statusMessage, this.messageCode));
  }

  ngOnDestroy() {
    if (this.queryParamsSubscription) { this.queryParamsSubscription.unsubscribe(); }
  }

}
