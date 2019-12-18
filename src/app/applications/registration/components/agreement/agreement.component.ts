import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { EarlyParrotService } from '@core/services/early-parrot.service';

import { EP_CAMPAIGNS_ID } from '@applications/early-parrot/config/early-parrot.conf';
import { UserService } from '@core/services/user/user.service';
import { UserModel } from '@core/models/user/user.model';
import { InvitationEnum } from '@shared/enums/invitation.enum';
import { environment } from '@environments/environment';
import { TrackingService } from '@core/services/tracking/tracking.service';
import { Category, Event, EventParams } from '@core/enums/analytics.enum';
import { InvitationActionEnum } from '@shared/enums/invitation.enum';

import { AgreementInvitationModel } from '../../models/agreement-invitation.model';
import { InvitationService } from '../../services/invitation.service';
import { AgreementDialogComponent } from './agreement-dialog/agreement-dialog.component';
import { UpdateTOSDialogComponent } from './update-tos-dialog/update-tos-dialog.component';


@Component({
  selector: 'app-agreement',
  styleUrls: ['./agreement.component.scss'],
  templateUrl: './agreement.component.html',
})
export class AgreementComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  public dialogRef: MatDialogRef<UpdateTOSDialogComponent | AgreementDialogComponent>;
  public agreementInvitation: AgreementInvitationModel;
  public user: UserModel;
  scriptTag: HTMLElement;
  noScriptTag: HTMLElement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private invitationService: InvitationService,
    private userService: UserService,
    private earlyParrot: EarlyParrotService,
    private cookieService: CookieService,
    private tracking: TrackingService,
  ) { }

  ngOnInit() {
    if (environment.production) {
      this.addFacebookPixel();
    }

    if (this.cookieService.check('rh') && this.cookieService.check('campaignId')) {
      if (this.cookieService.get('campaignId') === EP_CAMPAIGNS_ID.joinTheCommunity) {
        this.subscriptions.push(this.earlyParrot.createSubscribe(false).subscribe());
      }
    }

    this.subscriptions.push(this.userService.user$.subscribe(user => this.user = user));
    this.subscriptions.push(this.route.params.subscribe((params: Params) => {
      this.subscriptions.push(this.invitationService.
        getInvitation(params['hash'], InvitationEnum.TYPE_AGREEMENT).subscribe(invitation => {
          const inv = Object.assign(invitation, invitation.extraData);
          this.agreementInvitation = {...inv, hash: params['hash']};
          this.showAgreement();
        })
      );
    })
    );
  }

  addFacebookPixel() {
    this.scriptTag = document.createElement('script');
    this.scriptTag.textContent = '!function(f,b,e,v,n,t,s)\n' +
      '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n' +
      'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n' +
      'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';\n' +
      'n.queue=[];t=b.createElement(e);t.async=!0;\n' +
      't.src=v;s=b.getElementsByTagName(e)[0];\n' +
      's.parentNode.insertBefore(t,s)}(window,document,\'script\',\n' +
      '\'https://connect.facebook.net/en_US/fbevents.js\');\n' +
      'fbq(\'init\', ' + environment.FACEBOOK_PIXEL + '); \n' +
      'fbq(\'track\', \'PageView\');';
    this.noScriptTag = document.createElement('noscript');
    this.noScriptTag.textContent = '<img height="1" width="1" \n' +
      'src="https://www.facebook.com/tr?id=' + environment.FACEBOOK_PIXEL + '&ev=PageView\n' +
      '&noscript=1"/>';

    document.getElementsByTagName('head')[0].appendChild(this.scriptTag);
    document.getElementsByTagName('head')[0].appendChild(this.noScriptTag);
  }

  removeFacebookPixel() {
    this.scriptTag.parentNode.removeChild(this.scriptTag);
    this.noScriptTag.parentNode.removeChild(this.noScriptTag);
  }

  showAgreement() {
    if (this.route.snapshot.url.find(segment => segment.path === 'pending')) {
      this.dialogRef = this.dialog.open(UpdateTOSDialogComponent, {
        disableClose: true,
        role: 'alertdialog'
      });
    } else {
      this.dialogRef = this.dialog.open(AgreementDialogComponent, {
        disableClose: true,
        role: 'alertdialog'
      });
    }
    this.dialogRef.componentInstance.agreementInvitation = this.agreementInvitation;
    this.dialogRef.afterClosed().subscribe(agreement => {
      const action =
        agreement.action === InvitationActionEnum.ACCEPT ? EventParams.TOS_ACCEPTED : EventParams.TOS_DENIED;
      const declineData = agreement && agreement.comment ? { declined_message: agreement.comment } : {};

      this.subscriptions.push(
        this.invitationService.sendAction(
          agreement.action,
          this.agreementInvitation.hash,
          declineData
        ).subscribe(
          res => {
            this.tracking.track(Category.ONBOARDING, Event.UPDATED, { onboarding_actionDone: action });
            if (res.nextUrl) {
              this.router.navigate([res.nextUrl]);
            }
          }
        )
      );
    });
  }

  ngOnDestroy() {
    if (environment.production) {
      this.removeFacebookPixel();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
