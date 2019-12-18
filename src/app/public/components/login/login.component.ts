import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { LoginService } from '@public/services/login.service';
import { LocalStorageService, Urls, UrlService } from '@core/services';
import { socialNetworkType } from '@applications/shared/models';
import { HasKnownErrors } from '@shared/utils/form';

import { ShowAlertMessage } from '../../shared/alert-message-configuration';
import { PUBLIC_AREA_CONFIG, PublicAreaConfig } from '../../public-area.config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../public.scss']
})
export class LoginComponent extends ShowAlertMessage implements OnInit {
  public loginForm: FormGroup;
  public socialNetworks = socialNetworkType;
  nextUrl: string;
  constructor(
    @Inject(PUBLIC_AREA_CONFIG) public config: PublicAreaConfig,
    protected route: ActivatedRoute,
    protected translate: TranslateService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private urlService: UrlService,
    private localStorage: LocalStorageService,
    private router: Router,
  ) {
    super( route, translate );
    this.loginForm = this.fb.group({
      'username': [ '', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // We need to delete localStorage before to login from linkedIn
    this.localStorage.clean();
    super.ngOnInit();

  }

  onSubmit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => this.nextUrl = params.get('nextUrl'));
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    if ( this.loginForm.valid ) {
      this.loginService.login( username, password ).pipe(
        tap((res: any) => this.localStorage.setToken(res.token)),
       ).subscribe((res: any) => {
          // Tracking: (ActionGA.Login, {
          //   label: LabelGA.login,
          //   category: CategoryGA.Funnel
          // });

          this.localStorage.setToken(res.token);
          this.nextUrl ? this.router.navigateByUrl(this.nextUrl) : this.router.navigate(['/']);
        },
        error => HasKnownErrors(this.loginForm, error, 'password')
      );
    }
  }

  requestPasswordUrl(): string {
    return '/' + this.urlService.getPath( [Urls.PASSWORD_REQUEST] );
  }

}

