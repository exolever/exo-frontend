import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { UserModel } from '@core/models/user/user.model';
import { UserService } from '@core/services';
import { InvitationEnum, InvitationActionEnum } from '@shared/enums/invitation.enum';
import { FeedbackFormBehaviour } from '@shared/components/feedback-message/feedback-form-behaviour.class';

import { MessageService } from '@messages/messages.service';
import { OnboardingInvitationModel } from '../../models/onboarding-invitation.model';
import { InvitationService } from '../../services/invitation.service';
import { OnboardingStepperService } from './onboarding-stepper.service';
import { CookieService } from 'ngx-cookie-service';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { EP_CAMPAIGNS_ID } from '@applications/early-parrot/config/early-parrot.conf';

@Component({
  selector: 'app-on-boarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingStepperComponent extends FeedbackFormBehaviour implements OnInit, OnDestroy {
  public user: UserModel;
  public invitation: OnboardingInvitationModel;
  public dataToSend = {};
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private invitationService: InvitationService,
    private messageService: MessageService,
    private onboardingStepService: OnboardingStepperService,
    private translate: TranslateService,
    private cookieService: CookieService,
    private earlyParrot: EarlyParrotService
  ) {
    super();
  }

  ngOnInit() {
    if (this.cookieService.check('rh') && this.cookieService.check('campaignId')) {
      if (this.cookieService.get('campaignId') === EP_CAMPAIGNS_ID.joinTheCommunity) {
        this.subscriptions.add(this.earlyParrot.createSubscribe(true).subscribe(() => {
          this.cookieService.delete('rh');
          this.cookieService.delete('campaignId');
        }));
      }
    }
    this.subscriptions.add(this.userService.user$.subscribe(user => this.user = user));
    this.subscriptions.add(this.route.params.subscribe((params: Params) => {
      this.subscriptions.add(this.invitationService.
        getInvitation(params['hash'], InvitationEnum.TYPE_ONBOARDING).subscribe(invitation => {
          this.invitation = {...invitation, hash: params['hash']};
          this.onboardingStepService.activeStep(0);
        })
      );
    })
    );
  }

  goTo(information): void {
    if (information.hasOwnProperty('data')) {
      Object.keys(information.data).forEach(key => this.dataToSend[key] = information.data[key]);
    }
    if (information.hasOwnProperty('isLast') && information.isLast) {
      this.finish();
    } else {
      this.onboardingStepService.activeStep(information.step);
    }
  }

  finish(): void {
    this.subscriptions.add(this.invitationService
      .sendAction(InvitationActionEnum.ACCEPT, this.invitation.hash, this.dataToSend).subscribe(
        res => {
          if (res.nextUrl) {
            const param = {};
            param[this.user.entryPoint] = true;
            const  queryParams = { queryParams: param };
            this.router.navigate([res.nextUrl], queryParams).then(
              () => this.messageService.setMessagesList$()
            );
          }
        },
        () => this.createWrongFeedbackMessage(this.translate.instant('COMMON.ERRORS.REQUEST_NOT_SENT'))
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

