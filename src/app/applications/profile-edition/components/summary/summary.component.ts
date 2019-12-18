import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as MomentTZ from 'moment-timezone';

import { UserModel } from '@app/core';
import { ApiResources, UserService } from '@core/services';
import { AppState } from '@core/store/reducers';
import * as userActions from '@core/store/user/user.action';
import { UserPictureModel } from '@core/models/user/user-picture.model';
import { ConsultantModel } from '@applications/shared/models/consultant.model';
import { LanguageModel, UserApplicationModel } from '@applications/shared/models';
import { LanguageService } from '@applications/shared/services';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';
import { IGooglePlace } from '@shared/directives/google-places/google-place.interface';

enum SaveFormEnum {
  timezone,
  personalData,
  all
}

@Component({
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: UserApplicationModel | ConsultantModel;
  userLogged: UserModel;
  languageModel = LanguageModel;
  languages: Array<LanguageModel> = [];
  private subscriptions = new Subscription();

  personalButton = false;
  timeZoneButton = false;
  isDirty = false;
  isConsultant = false;

  // Timezone
  listTimeZones = MomentTZ.tz.names().map(tz => tz.replace(/_/g, ' '));
  filteredTz: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private languagesService: LanguageService,
    private snackBarService: ProfileEditSnackBarService,
    private profileEditionService: ProfileEditionService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.store.pipe(select(state => fromProfile.getProfileUser(state)))
        .subscribe(profileUser => {
          if (profileUser) {
            this.isConsultant = profileUser instanceof ConsultantModel;
            this.user = profileUser;
            if (!this.form) {
              this.form = this.buildForms();
            }
          }
        })
    );

    this.subscriptions.add(
      this.userService.user$.subscribe((user) => {
        this.userLogged = user;
      })
    );
    this.languagesService.getLanguages().subscribe(res => this.languages = res);
  }

  buildForms() {
    const personalForm = this.createFormGroup(this.buildPersonalForm());
    personalForm.valueChanges.subscribe(() => {
      this.personalButton = true;
      this.isDirty = true;
    });

    const timeZoneForm = this.createFormGroup(this.buildTimezoneForm());
    timeZoneForm.valueChanges.subscribe(() => {
      this.timeZoneButton = true;
      this.isDirty = true;
    });

    this.filteredTz = timeZoneForm.valueChanges.pipe(
      startWith(null),
      map(name => this.filterTz(name))
    );

    return this.fb.group({
      personal: personalForm,
      timezone: timeZoneForm
    });
  }

  filterTz(val: { timezone: string }) {
    return val ? this.listTimeZones.filter(
      s => new RegExp(`${val.timezone}`, 'gi').test(s)
    ) : this.listTimeZones;
  }

  createFormGroup(controls: any) {
    const formGroup = new FormGroup({});
    controls.map((obj) => {
      formGroup.addControl(obj.name, new FormControl(obj.values, obj.validators));
    });
    return formGroup;
  }

  buildTimezoneForm() {
    const value = this.user.timezone || MomentTZ.tz.guess();
    return [
      {
        name: 'timezone',
        values: value.replace(/_/g, ' '),
        validators: [Validators.required]
      }
    ];
  }

  buildPersonalForm() {
    const fields: Array<any> = [
      {
        name: 'full_name',
        values: this.user.fullName,
        validators: [Validators.required, Validators.maxLength(255)]
      },
      {
        name: 'short_name',
        values: this.user.shortName,
        validators: [Validators.required, Validators.maxLength(100)]
      },
      {
        name: 'location',
        values: this.user.location,
        validators: [Validators.required, Validators.maxLength(255)]
      },
      {
        name: 'placeId',
        values: this.user.placeId,
        validators: [Validators.required]
      }
    ];

    if (this.isConsultant) {
      fields.push({
        name: 'languages',
        values: (<ConsultantModel>this.user).languages ? (<ConsultantModel>this.user).languages.slice() : [],
        validators: [Validators.required, Validators.minLength(1)]
      });
    }

    return fields;
  }

  // onSelect event emitter Google Place location.
  setLocation(addrObj: IGooglePlace) {
    this.form.get('personal').get('location').setValue(addrObj.name);
    this.form.get('personal').get('placeId').setValue(addrObj.placeId);
    this.showLocationErrors();
  }

  isValidPersonalDataForm(): boolean {
    this.form.get('personal').markAllAsTouched();
    return this.form.controls.personal.valid;
  }

  buildPersonalDataToSave() {
    const data = {
      'full_name': this.form.controls.personal.value.full_name,
      'short_name': this.form.controls.personal.value.short_name,
      'location': this.form.controls.personal.value.location,
      'place_id': this.form.controls.personal.value.placeId,
    };

    if (this.form.controls.personal.value.languages) {
      data['languages'] = this.form.controls.personal.value.languages.map(lang => lang.pk);
    }
    return data;
  }

  buildPersonalDataUpdateUser() {
    const data = {
      fullName: this.form.controls.personal.value.full_name,
      shortName: this.form.controls.personal.value.short_name,
      location: this.form.controls.personal.value.location,
      placeId: this.form.controls.personal.value.placeId,
    };
    if (this.isConsultant) {
      data['languages'] = this.form.controls.personal.value.languages;
    }
    return data;
  }

  onSubmitPersonal() {
    if (this.isValidPersonalDataForm()) {
      this.onSubmit(
        this.buildPersonalDataToSave(),
        this.buildPersonalDataUpdateUser(),
        SaveFormEnum.personalData
      );
    } else {
      this.showLocationErrors();
    }
  }

  showLocationErrors() {
    if (this.form.get('personal').get('placeId').errors) {
      this.form.get('personal').get('location').setErrors({ 'autoCompleteValidator': true });
      this.form.get('personal').get('location').markAsTouched();
    }
  }

  isValidTimezoneForm(): boolean {
    return this.form.controls.timezone.valid;
  }

  buildTimezoneToSaveUpdateUser() {
    return { 'timezone' : this.form.controls.timezone.value.timezone.replace(/ /g, '_')};
  }

  onSubmitTimeZone() {
    if (this.isValidTimezoneForm()) {
      this.onSubmit(
        this.buildTimezoneToSaveUpdateUser(),
        this.buildTimezoneToSaveUpdateUser(),
        SaveFormEnum.timezone
      );
    }
  }

  buildAvatarUpdateUser(picture: any[]) {
    const picturesList = picture.map(
      pict => new UserPictureModel({ height: pict[0][0], width: pict[0][1], url: pict[1]})
    );
    this.store.dispatch(new profileActions.UpdateUser({
      user: this.user,
      data: {'profilePictures': picturesList}
    }));

    if (this.user.uuid === this.userLogged.uuid) {
      this.store.dispatch(new userActions.UpdatePictureUser({profilePictures: picturesList}));
    }
  }

  updateAvatar(image: File): void {
    this.profileEditionService
      .updateImageProfile(this.user.pk, image)
      .subscribe(images => this.buildAvatarUpdateUser(images));
  }

  managementButtons(saveForm: SaveFormEnum) {
    switch (saveForm) {
      case SaveFormEnum.personalData:
        this.personalButton = false;
        break;
      case SaveFormEnum.timezone:
        this.timeZoneButton = false;
        break;
      case SaveFormEnum.all:
        this.personalButton = false;
        this.timeZoneButton = false;
        break;
    }
  }

  onSubmit(dataToSave: object, dataUpdateUser: object, formTosave: SaveFormEnum) {
    this.profileEditionService.saveData(
      this.user.pk,
      dataToSave,
      ApiResources.PROFILE_EDIT_ECOSYSTEM_SUMMARY
    ).subscribe(
      () => {
        this.store.dispatch(new profileActions.UpdateUser({
          user: this.user,
          data: dataUpdateUser
        }));
        this.isDirty = false;
        this.managementButtons(formTosave);
        this.snackBarService.success();
      },
        () => {
          this.snackBarService.error();
          this.managementButtons(formTosave);
        }
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
