import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import { ApiResources } from '@app/core';
import {
  UserApplicationModel, ConsultantModel, socialNetworkType, SocialNetworkModel
} from '@applications/shared/models';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';
import { urlValidator } from '@shared/custom-validations/';


enum SaveFormEnum {
  biography,
  socialNetwork,
  contact,
  all
}

@Component({
  templateUrl: './about-you.component.html',
  styleUrls: ['./about-you.component.scss']
})
export class AboutYouComponent implements OnInit, OnDestroy {

  form: FormGroup;

  user: UserApplicationModel | ConsultantModel;
  socialNetworksEnum = socialNetworkType;

  biographyButton = false;
  socialNetworksButton = false;
  contactInformationButton = false;
  isDirty = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private profileEditionService: ProfileEditionService,
    private snackBarService: ProfileEditSnackBarService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(state => fromProfile.getProfileUser(state))).subscribe( profileUser => {
          if (profileUser) {
            this.user = profileUser;
            if (!this.form) {
              this.form = this.buildsForm();
            }
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  buildsForm() {
    const biographyForm = this.createFormGroup(this.buildBiographyForm());
    biographyForm.valueChanges.subscribe(() => {
      this.biographyButton = true;
      this.isDirty = true;
    });

    const socialNetworkForm = this.createFormGroup(this.buildSocialNetwork());
    socialNetworkForm.valueChanges.subscribe(() => {
      this.socialNetworksButton = true;
      this.isDirty = true;
    });

    const contactForm = this.createFormGroup(this.buildContactForm());
    contactForm.valueChanges.subscribe(() => {
      this.contactInformationButton = true;
      this.isDirty = true;
    });

    return this.fb.group({
      biography: biographyForm,
      social: socialNetworkForm,
      contact: contactForm
    });
  }

  createFormGroup(controls: any) {
    const formGroup = new FormGroup({});
    controls.map((obj) => {
      formGroup.addControl(obj.name, new FormControl(obj.values, obj.validators));
    });
    return formGroup;
  }

  buildBiographyForm() {
    return [
      {
        name: 'biography',
        values: this.user.bioMe,
        validators: Validators.maxLength(3500)
      }
    ];
  }

  buildSocialNetwork() {
    return [
      {
        name: 'website',
        values: this.user.getSocialNetwork(this.socialNetworksEnum.website.toString()),
        validators: urlValidator()
      },
      {
        name: 'linkedin',
        values: this.user.getSocialNetwork(this.socialNetworksEnum.linkedin.toString()),
        validators: Validators.pattern(
          new RegExp('^(http(s)?:\\/\\/)+(?:.*\\.)?linkedin\\.com\\/(pub|in|profile)\\/(.*)')
        )
      },
      {
        name: 'twitter',
        values: this.user.getSocialNetwork(this.socialNetworksEnum.twitter.toString()),
        validators:
          Validators.pattern(
            new RegExp(
              '^(http(s)?:\\/\\/)+(?:.*\\.)?twitter\\.com\\/(?:#!\\/)?@?([^\\?#]*)(?:[?#].*)?$'
            )
          )
      },
      {
        name: 'facebook',
        values: this.user.getSocialNetwork(this.socialNetworksEnum.facebook.toString()),
        validators:
          Validators.pattern(new RegExp(
            // tslint:disable-next-line:max-line-length
            '^(http(s)?:\\/\\/)+(?:.*\\.)?facebook\\.com\\/(?:(?:\\w\\.)*#!\\/)?(?:pages\\/)?(?:[\\w\\-\\.]*\\/)*([\\w\\-\\.]*)'
          )
        )
      }
    ];
  }

  buildContactForm() {
    return [
      {
        name: 'phone',
        values: this.user.phone,
        validators: Validators.pattern(new RegExp('[0-9\(\)\-]'))
      },
      {
        name: 'skype',
        values: this.user.getSocialNetwork(this.socialNetworksEnum.skype.toString())
      }
    ];
  }

  isValidBiographyForm(): boolean {
    return this.form.controls.biography.valid;
  }

  buildBiographyDataToSave() {
    return {'bio_me' : this.form.controls.biography.value.biography};
  }

  buildBiographyDataUpdateUser() {
    return {'bioMe': this.form.controls.biography.value.biography};
  }

  onSubmitBiography() {
    if (this.isValidBiographyForm()) {
      this.onSubmit(
        this.buildBiographyDataToSave(),
        this.buildBiographyDataUpdateUser(),
        SaveFormEnum.biography
      );
    }
  }

  managementButtons(saveForm: SaveFormEnum) {
    switch (saveForm) {
      case SaveFormEnum.biography:
        this.biographyButton = false;
        break;
      case SaveFormEnum.contact:
        this.contactInformationButton = false;
        break;
      case SaveFormEnum.socialNetwork:
        this.socialNetworksButton = false;
        break;
      case SaveFormEnum.all:
        this.biographyButton = false;
        this.contactInformationButton = false;
        this.socialNetworksButton = false;
        break;
    }
  }

  onSubmit(dataToSave: object, dataUpdateUser: object, formTosave: SaveFormEnum) {
    this.profileEditionService.saveData(
      this.user.pk,
      dataToSave,
      ApiResources.PROFILE_EDIT_ECOSYSTEM_ABOUT_YOU
    ).subscribe(
      data => {
        this.store.dispatch(new profileActions.UpdateUser({
          user: this.user,
          data: dataUpdateUser
        }));
        this.isDirty = false;
        this.managementButtons(formTosave);
        this.snackBarService.success(
          this.translateService.instant('ECOSYSTEM.PROFILE.EDIT.ABOUT_YOU.BIOGRAPHY_TOAST')
        );
      },
        () => {
          this.snackBarService.error();
          this.managementButtons(formTosave);
        }
      );
  }

  isValidSocialNetworkForm(): boolean {
    return this.form.controls.social.valid;
  }

  buildSocialNetworDataToSave() {
    return this.form.controls.social.value;
  }

  buildSocialNetworkDataUpdateUser() {
    const newData = this.form.controls.social.value;
    const dataToSend = Object.keys(newData).filter(key => newData[key] !== '' ).map(key => {
      const sn = new SocialNetworkModel();
      sn.networkType = this.socialNetworksEnum[key];
      sn.value = newData[key];
      return sn;
    });
    return { socialNetworks: dataToSend };
  }

  onSubmitSocialNetwork() {
    if (this.isValidSocialNetworkForm()) {
      this.onSubmit(
        this.buildSocialNetworDataToSave(),
        this.buildSocialNetworkDataUpdateUser(),
        SaveFormEnum.socialNetwork
      );
    }
  }
  isValidContactForm(): boolean {
    return this.form.controls.contact.valid;
  }

  buildContactDataToSave() {
    const data = this.form.controls.contact.value;
    return {
      // 'email_contact': data.emailContact,
      'skype': data.skype,
      'phone': data.phone
    };
  }

  buildContactDataUpdateUser() {
    const skypeData = new SocialNetworkModel();
    skypeData.networkType = this.socialNetworksEnum.skype.toString();
    skypeData.value = this.form.controls.contact.value.skype;

    const snToSend = this.user.socialNetworks.filter(
      (obj: SocialNetworkModel) => obj.networkType !== this.socialNetworksEnum.skype.toString()
    );
    snToSend.push(skypeData);
    return {
      socialNetworks: snToSend,
      phone: this.form.controls.contact.value.phone/*,
      emailContact: this.form.controls.contact.value.emailContact*/
    };
  }

  onSubmitContact() {
    if (this.isValidContactForm()) {
      this.onSubmit(
        this.buildContactDataToSave(),
        this.buildContactDataUpdateUser(),
        SaveFormEnum.contact
      );
    }
  }

}
