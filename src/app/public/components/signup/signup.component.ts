import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { Urls, LocalStorageService, UrlService } from '@core/services';
import { HasKnownErrors } from '@shared/utils/form';
import { Category, Event, EventParams } from '@core/enums/analytics.enum';
import { TrackingService } from '@core/services/tracking/tracking.service';

import { SignupService } from '../../services/signup.service';
import { SignupModel } from '../../models/signup.model';
import { ShowAlertMessage } from '../../shared/alert-message-configuration';
import { PUBLIC_AREA_CONFIG, PublicAreaConfig } from '../../public-area.config';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['../../public.scss']
})
export class SignupComponent extends ShowAlertMessage implements OnInit, OnDestroy {
  signupForm: FormGroup;
  private invitationUser = new SignupModel();
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PUBLIC_AREA_CONFIG) public config: PublicAreaConfig,
    protected route: ActivatedRoute,
    protected translate: TranslateService,
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private urlService: UrlService,
    private router: Router,
    private signUpService: SignupService,
    private tracking: TrackingService,
  ) {
    super(route, translate);
    this.signupForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    // We need to delete localStorage before to signup from linkedin
    this.localStorage.clean();
    super.ngOnInit();

    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.subscriptions.push(
          this.signUpService.getSignupInvitation(params['hash']).subscribe(
            invitation => {
              this.invitationUser.hash = params['hash'];
              const inv = Object.assign(invitation, invitation.extraData);
              this.signupForm.controls['email'].setValue(inv.email);
            }
          )
        );
      })
    );
  }

  onSubmit() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    if (this.signupForm.valid) {
      this.subscriptions.push(
        this.signUpService.signup(email, password, this.invitationUser.hash).subscribe(
        (resp: any) => {
          this.tracking.track(
            Category.ONBOARDING,
            Event.UPDATED,
            { onboarding_actionDone: EventParams.SIGNUP_COMPLETED }
          );
          if (resp.token && resp.nextUrl) {
              this.localStorage.setToken(resp.token);
              this.router.navigate([resp.nextUrl]);
          }
        },
        err => HasKnownErrors(this.signupForm, err)
        )
      );
    }
  }

  goToLogin(): string {
    return '/' + this.urlService.getPath([Urls.LOGIN]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe() );
  }
}
