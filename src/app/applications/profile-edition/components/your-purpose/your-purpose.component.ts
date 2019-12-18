import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { ApiResources } from '@app/core';
import { AppState } from '@core/store/reducers';
import { ConsultantModel } from '@applications/shared/models';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';

import { ProfileEditSnackBarService } from '../../services/snack-bar.service';
import { ProfileEditionService } from '../../services/profile-edition.service';

@Component({
  templateUrl: './your-purpose.component.html',
  styleUrls: ['./your-purpose.component.scss']
})
export class YourPurposeComponent implements OnInit, OnDestroy {

  user: ConsultantModel;
  purposeMaxLength = 144;
  form: FormGroup;
  showEditButton = false;
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
      this.store.pipe(select(state => fromProfile.getProfileUser(state)))
        .subscribe((profileUser: ConsultantModel) => {
          if (profileUser) {
            this.user = profileUser;
            if (!this.form) {
              this.form = this.buildForm();
            }
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  buildForm() {
    const purposeForm = this.createFormGroup(this.buildPurposeForm());
    purposeForm.valueChanges.subscribe(() => {
      this.showEditButton = true;
      this.isDirty = true;
    });
    return this.fb.group({
      purpose: purposeForm
    });
  }

  buildPurposeForm() {
    return [
      {
        name: 'purpose',
        values: this.user.mtp,
        validators: Validators.maxLength(this.purposeMaxLength)
      }
    ];
  }

  createFormGroup(controls: any) {
    const formGroup = new FormGroup({});
    controls.map((obj) => {
      formGroup.addControl(obj.name, new FormControl(obj.values, obj.validators));
    });
    return formGroup;
  }

  isValidPurposeForm(): boolean {
    return this.form.controls.purpose.valid;
  }

  onSubmitPurpose() {
    if (this.isValidPurposeForm()) {
      const mtpToSend = this.form.controls.purpose.value.purpose;
      this.profileEditionService.saveData(
        this.user.pkConsultant,
        { 'personal_mtp': mtpToSend },
        ApiResources.PROFILE_EDIT_MTP
      ).subscribe(() => {
        this.store.dispatch(new profileActions.UpdateUser({ user: this.user, data: { 'mtp': mtpToSend } }));
        this.isDirty = false;
        this.showEditButton = false;
        this.snackBarService.success(this.translateService.instant('ECOSYSTEM.PROFILE.EDIT.PURPOSE.TOAST'));
      },
      () => {
        this.showEditButton = false;
        this.snackBarService.error();
      });
    }
  }

}
