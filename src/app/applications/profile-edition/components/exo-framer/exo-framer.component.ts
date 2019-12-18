import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { ApiResources } from '@app/core';
import { AppState } from '@core/store/reducers';
import { getStringEnum } from '@shared/helpers/enum.helper';
import { ProfileHelpPopoverEnum } from '@applications/profile/enums/profile-help-popover.enum';
import { ConsultantModel } from '@applications/shared/models';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';

import { ProfileEditionService } from '../../services/profile-edition.service';
import { ProfileEditSnackBarService } from '../../services/snack-bar.service';

enum SaveFormEnum {
  ideas,
  scale,
  mtp,
  all
}
@Component({
  templateUrl: './exo-framer.component.html',
  styleUrls: ['./exo-framer.component.scss']
})
export class ExoFramerComponent implements OnInit, OnDestroy {

  /** form stuff */
  form: FormGroup;
  showMtpButton = false;
  showIdeasButton = false;
  showScalesButton = false;
  isDirty = false;

  user: ConsultantModel;
  helpPopoverEnum = ProfileHelpPopoverEnum;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private profileEditionService: ProfileEditionService,
    private snackBarService: ProfileEditSnackBarService
  ) {}

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
    this.subscriptions.forEach( s => s.unsubscribe() );
  }

  /**
   * form builder
   * @returns {FormGroup}
   */
  buildForm(): FormGroup {
    const mtpForm = new FormGroup({});
    mtpForm.addControl('mtp', new FormControl(this.user.valueMTP));
    const ideasForm = this.createFormGroup(this.user.getInternalEXOAttributes());
    const scaleForm = this.createFormGroup(this.user.getExternalEXOAttributes());

    /** create form value changes subscriptions */
    this.subscriptions.push(
      mtpForm.valueChanges.subscribe(() => {
        this.isDirty = true;
        this.showMtpButton = true;
      }),
      ideasForm.valueChanges.subscribe(() => {
        this.isDirty = true;
        this.showIdeasButton = true;
      }),
      scaleForm.valueChanges.subscribe(() => {
        this.isDirty = true;
        this.showScalesButton = true;
      })
    );

    return this.fb.group({
      mtp: mtpForm,
      ideas: ideasForm,
      scales: scaleForm
    });
  }

  createFormGroup(valueList): FormGroup {
    const fromGroup = new FormGroup({});
    valueList.map(att => {
      fromGroup.addControl(att.pk, new FormControl(att.level));
    });
    return fromGroup;
  }

  isValidMtpForm(): boolean {
    return this.form.get('mtp').valid;
  }

  buildMtpToSave() {
    return { 'mtp_mastery': this.form.get('mtp').value['mtp'] };
  }

  buildMtpUpdateUser() {
    return {'valueMTP': this.form.get('mtp').value['mtp']};
  }

  onSubmitMtp() {
    if (this.isValidMtpForm()) {
      const data = this.buildMtpToSave();
      this.profileEditionService.saveData(
        this.user.pkConsultant,
        data,
        ApiResources.PROFILE_EDIT_MTP
      ).subscribe(res => {
        this.store.dispatch(new profileActions.UpdateUser({ user: this.user, data: this.buildMtpUpdateUser() }));
        this.isDirty = false;
        this.showMtpButton = false;
        this.snackBarService.success();
      });
    }
  }

  isValidIdeasForm(): boolean {
    return this.form.get('ideas').valid;
  }

  buildAttributesToSave(): object {
    const values = [];
    const ideaValues = this.form.get('ideas').value;
    Object.keys(ideaValues).map(keyIdea => {
      values.push({ 'level': ideaValues[keyIdea], 'id': keyIdea });
    });
    const scaleValues = this.form.get('scales').value;
    Object.keys(scaleValues).map(keyScale => {
      values.push({ 'level': scaleValues[keyScale], 'id': keyScale });
    });
    return { 'exo_attributes': values };
  }

  buildAttributesUpdateUser(newData, groupDataToUpdate?) {
    const dataToUpdate = this.user.exoAttributes.map(attr => {
      if ( !groupDataToUpdate || attr.pk in groupDataToUpdate) {
        const a = newData.exo_attributes.find(exoAttr => +attr.pk === +exoAttr.id);
        attr.level = a.level;
      }
      return attr;
    });
    return { 'exoAttributes': dataToUpdate };
  }

  onSubmitIdeas() {
    if (this.isValidIdeasForm()) {
      const data = this.buildAttributesToSave();
      this.onSubmitAttributes(
        data,
        this.buildAttributesUpdateUser(data, this.form.get('ideas').value),
        SaveFormEnum.ideas
      );
    }
  }

  isValidScalesForm(): boolean {
    return this.form.get('scales').valid;
  }

  onSubmitScales() {
    if (this.isValidScalesForm()) {
      const data = this.buildAttributesToSave();
      this.onSubmitAttributes(
        data,
        this.buildAttributesUpdateUser(data, this.form.get('scales').value),
        SaveFormEnum.scale
      );
    }
  }

  managementButtons(saveForm: SaveFormEnum) {
    switch (saveForm) {
      case SaveFormEnum.ideas:
        this.showIdeasButton = false;
        break;
      case SaveFormEnum.scale:
        this.showScalesButton = false;
        break;
      case SaveFormEnum.mtp:
        this.showMtpButton = false;
        break;
      case SaveFormEnum.all:
        this.showIdeasButton = false;
        this.showScalesButton = false;
        this.showMtpButton = false;
        break;
    }
  }

  onSubmitAttributes(dataToSave: object, dataUpdateUser: object, formTosave: SaveFormEnum) {
    this.profileEditionService.saveData(
      this.user.pkConsultant,
      dataToSave,
      ApiResources.PROFILE_EDIT_ATTRIBUTES_USER
    ).subscribe(
      data => {
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


  parseResponse(data: any) {
    this.user.exoAttributes.map(att => {
      const newExoAttr = data.find(a => a.id === att.pk);
      if (newExoAttr !== undefined) {
        att.level = newExoAttr.level;
      }
    });
  }

  /** gets the mtp key and values in the right format for the post http call */
  getValue(formGroup: string, field: string): number {
    return this.form.get(formGroup).value[field];
  }

  getHelpPopoverType(name: string) {
    return getStringEnum(ProfileHelpPopoverEnum, name);
  }

}
