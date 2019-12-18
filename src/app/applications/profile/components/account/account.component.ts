import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '@core/store/reducers';
import { AccountUserService } from '@applications/profile/services/account.service';
import { LANGUAGES_CONF } from '@app/app-config';
import { LocalStorageService } from '@core/services';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import { ChangePasswordService } from '@applications/profile/services/change-password.service';
import { LanguageModel } from '@applications/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLanguageService } from '@applications/profile/services/change-language.service';
import { ChangeContractingService } from '@applications/profile/services/change-contracting.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  PlatformChangeEmailComponent
} from '@applications/profile/components/account/change-email/platform-change-email.component';
import { MessageService } from '@messages/messages.service';
import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '@applications/profile/profile-view.config';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import * as fromUser from '@core/store/user/user.reducer';
import { AgreementModel } from '@core/models/user/agreement.model';

interface INotificationsAccount {
  name: string;
  group: string;
  id: number;
  value: boolean;
}

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  user;
  form: FormGroup;
  languages: LanguageModel[] = [];
  agreements: AgreementModel[] = [];

  showAccountButton = false;
  showLanguageButton = false;
  showContractingButton = false;
  showNotificationsButton = false;

  notificationsList: INotificationsAccount[];
  private changeEmailRef: MatDialogRef<PlatformChangeEmailComponent>;
  private subscription = new Subscription();

  @ViewChild('showhideinput', {static: false}) input: ElementRef;

  constructor(
    private accountUserService: AccountUserService,
    public route: ActivatedRoute,
    private contractingService: ChangeContractingService,
    private fb: FormBuilder,
    private languageService: ChangeLanguageService,
    private localStorage: LocalStorageService,
    private matDialog: MatDialog,
    private matSnack: ProfileEditSnackBarService,
    private messageService: MessageService,
    private passwordService: ChangePasswordService,
    private translateService: TranslateService,
    private breadCrumbService: BreadCrumbService,
    public location: Location,
    private store: Store<AppState>,
    @Inject(PROFILE_VIEW_CONFIG) public config: ProfileViewConfig
  ) { }

  ngOnInit() {
    this.breadCrumbService.resetBreadcrumb();
    this.subscription.add(
      this.store.pipe(select((state) => fromUser.getUser(state))).subscribe(user => {
        this.agreements = user ? user.agreements : [];
      })
    );

    this.getLanguages();
    this.subscription.add(
      this.route.params.subscribe(params => {
        this.accountUserService.getUserInfo(params.pk).subscribe((user: any) => {
          this.user = user;
          this.accountUserService.getNotifications(params.pk).subscribe((notifications) => {
            this.createNotificationsList(notifications);
            this.form = this.buildForm();
          });
        });
      })
    );
  }

  createNotificationsList(notifications: INotificationsAccount[]): void {
    const EXCLUDE_NOTIFICATION = 'consent';
    const ORDER_GROUPBY_NOTIFICATIONS = ['circles', 'opportunities', 'swarm_sessions'];

    this.notificationsList = notifications
      .filter(notification => notification.group !== EXCLUDE_NOTIFICATION)
      .sort( (a, b) => ORDER_GROUPBY_NOTIFICATIONS.findIndex(
          itemA => itemA === a.group) - ORDER_GROUPBY_NOTIFICATIONS.findIndex(itemB => itemB === b.group));
  }

  getLanguages() {
    Object.keys(LANGUAGES_CONF.ACCOUNTS_LANGUAGES).forEach((key) => {
      this.languages.push(new LanguageModel(
        this.translateService.instant(key),
        LANGUAGES_CONF.ACCOUNTS_LANGUAGES[key])
      );
    });
  }

  buildForm(): FormGroup {
    return this.fb.group({
      accounts: this.buildAccount(),
      languages: this.buildLanguage(),
      contractings: this.buildContracting(),
      notifications: this.buildNotifications()
    });
  }

  buildAccount(): FormGroup {
    const accountForm = this.fb.group({
      password: ['', [Validators.minLength(8)]]
    });

    accountForm.valueChanges.subscribe(() => {
      this.showAccountButton = true;
    });

    return accountForm;
  }

  buildLanguage(): FormGroup {
    const lang = this.localStorage.getItem(LANGUAGES_CONF.KEY_LOCALSTORAGE) || LANGUAGES_CONF.DEFAULT_LANGUAGE;

    const languageForm = this.fb.group({
      language: [lang, Validators.required]
    });

    languageForm.valueChanges.subscribe(() => {
      this.showLanguageButton = true;
    });

    return languageForm;
  }

  buildContracting(): FormGroup {

    const contractingForm = this.fb.group({
      name: [this.user.legalName],
      address: [this.user.legalAddress],
      company_name: [this.user.legalCompanyName],
      tax_id: [this.user.taxId]
    });

    contractingForm.valueChanges.subscribe(() => {
      this.showContractingButton = true;
    });

    return contractingForm;
  }

  buildNotifications(): FormGroup {
    const notificationsForm = this.fb.group({});
    this.notificationsList.forEach((notification, index) => {
      notificationsForm.addControl(
        notification.id.toString(),
        new FormControl(notification.value)
      );
    });

    return notificationsForm;
  }

  changeNotification(event, notification) {
    notification.value = event.checked;
    this.form.controls.notifications.get(notification.id.toString()).markAsTouched();
    this.showNotificationsButton = true;
  }

  submitPassword() {
    if (this.form.controls.accounts.valid) {
      this.changePassword();
    }
  }

  changePassword() {
    this.passwordService.changePassword(this.user.pk, this.form.controls.accounts.value.password)
      .subscribe(() => {
        this.showAccountButton = false;
        this.matSnack.success();
      },
        err => this.form.controls.accounts.get('password').setErrors(err));
  }

  submitLanguages() {
    if (this.form.controls.languages.valid) {
      const language = this.form.controls.languages.value.language;
      this.languageService.changeLanguage(
        this.user.pk,
        this.form.controls.languages.value.language
      )
        .subscribe(() => {
          this.localStorage.setItem(
            LANGUAGES_CONF.KEY_LOCALSTORAGE,
            language
          );
          this.translateService.use(language);
          this.showLanguageButton = false;
          this.matSnack.success(this.translateService.instant('ACCOUNTS.LANGUAGES.LANGUAGE_CHANGED'));
        });
    }
  }

  submitContractings() {
    if (this.form.controls.contractings.valid) {
      this.contractingService.changeContracting(
        this.user.pk,
        this.form.controls.contractings.value
      )
        .subscribe(() => {
          this.matSnack.success(
            this.translateService.instant('NOTIFICATION.UPDATED')
          );
          this.showContractingButton = false;
        });
    }
  }

  submitNotifications() {
    if (this.form.controls.notifications.valid) {
      const controls = this.form.controls.notifications['controls'];
      const touched = Object.keys(controls).filter(key => controls[key].touched === true);
      touched.forEach(id => {
        const notification = this.notificationsList.find(not => not.id.toString() === id);
        this.accountUserService.changeNotifications(
          this.user.pk,
          notification.id.toString(),
          notification.value
        ).subscribe(() => {
          this.matSnack.success(
            this.translateService.instant('NOTIFICATION.UPDATED')
          );
          this.showNotificationsButton = false;
        });
      });
    }
  }

  /**
   * get value and translate
   * @param {string} name
   * @returns {any}
   */
  transformName(name: string) {
    return this.translateService.instant(`ECOSYSTEM.PROFILE.ACCOUNT.${name.toUpperCase()}`);
  }

  changeEmail() {
    this.changeEmailRef = this.matDialog.open(
      PlatformChangeEmailComponent,
      {
        data: { user: this.user },
        disableClose: false,
        role: 'alertdialog'
      }
    );

    this.subscription.add(
      this.changeEmailRef.afterClosed().subscribe(result => {
        if (!result) {
          return false;
        }

        if (this.user.email === result) {
          this.messageService.setMessagesList$();
        }

        this.user.email = result;
      })
    );
  }

  toggleShowHidePassword(event) {
    if (this.input.nativeElement.type !== 'text') {
      this.input.nativeElement.type = 'text';
      event.currentTarget.textContent = 'visibility_off';
    } else {
      this.input.nativeElement.type = 'password';
      event.currentTarget.textContent = 'visibility';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
