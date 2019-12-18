import { Component, Input, OnDestroy } from '@angular/core';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@environments/environment';
import { UserModel } from '@core/models/user/user.model';
import { typeformRecommend, TypeformStatus } from '@shared/enums/typeform-status.enum';
import { enableScrollAfterTypeformClose } from '@shared/utils/typeform/typeform-utils';
import { UrlService } from '@app/core';
import { OverlayService } from '@overlay/services/overlay.service';
import {
TypeFormIntegrationComponent
} from '../typeform-integration/typeform-integration.component';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-member-dialog.component.html',
  styleUrls: ['./invite-member-dialog.component.scss']
})
export class InviteModalComponent implements OnDestroy {
  @Input() user: UserModel;
  @Input() inExpansionPanel = false;
  // base translate
  baseTranslateString = 'DASHBOARD.DIRECTORY.INVITE_ASIDE.';
  // controller data
  environment = environment;
  private subscriptions: Subscription[] = [];
  private typeFormStatus = TypeformStatus.INITIAL;

  constructor(
    private urlService: UrlService,
    private overlayService: OverlayService,
    private translate: TranslateService
  ) { }

  // since the recommendation comes from directory, two empty strings will be sent where project name and
  // ticket title shall be added in an active project context recommendation
  recommendSomeone( typeformBaseUrl: string ): void {
    const url = this.urlService.resolveGetParams(
      typeformBaseUrl,
      [
        typeformRecommend.PR_NAME,
        typeformRecommend.TCK_TITLE,
        typeformRecommend.FULLNAME,
        typeformRecommend.EMAIL
      ],
      [
        '',
        '',
        this.user.fullName,
        this.user.email
      ]
    );
    this.overlayService.open(
      <Component>TypeFormIntegrationComponent,
      { data:
          { title: this.translate.instant('UTILS.TYPEFORM.RECOMMEND'), url: url }
      }
    );

    this.subscriptions.push(
      this.overlayService.afterClosed.pipe ( filter(result => result === true) ).subscribe(() => {
        this.typeFormStatus !== TypeformStatus.RECEIVE ?
          this.typeFormStatus = TypeformStatus.SENT :
          this.typeFormStatus = TypeformStatus.DEFAULT;
      })
    );

    this.subscriptions.push(
      this.overlayService.afterClosed.subscribe( () => {
        enableScrollAfterTypeformClose();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe() );
  }

}
