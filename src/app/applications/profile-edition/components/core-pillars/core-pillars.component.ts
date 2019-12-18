import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { ApiResources } from '@app/core';
import { AppState } from '@core/store/reducers';
import { ConsultantModel } from '@applications/shared/models';
import { ExoAreasEnum } from '@applications/shared/enums/exo-areas.enum';
import { exoAreasSectionConfiguration } from '@shared/configs/exo-areas-section.config';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';

@Component({
  templateUrl: './core-pillars.component.html'
})
export class CorePillarsComponent implements OnInit, OnDestroy {

  form = this.fb.group({});
  pillarsList = exoAreasSectionConfiguration;

  user: ConsultantModel;
  private subscriptions: Subscription[] = [];

  isDirty = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private profileEditionService: ProfileEditionService,
    private snackBarService: ProfileEditSnackBarService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(state => fromProfile.getProfileUser(state)))
        .subscribe((profileUser: ConsultantModel) => {
          if (profileUser) {
            this.user = profileUser;
            this.buildForm();
          }
        })
    );
  }

  buildForm() {
    this.form.addControl(
      ExoAreasEnum.ORGANIZATIONS.toString(),
      new FormControl(this.user.getExoArea(ExoAreasEnum.ORGANIZATIONS.toString()))
    );
    this.form.addControl(
      ExoAreasEnum.INSTITUTIONS.toString(),
      new FormControl(this.user.getExoArea(ExoAreasEnum.INSTITUTIONS.toString()))
    );
    this.form.addControl(
      ExoAreasEnum.PEOPLE.toString(),
      new FormControl(this.user.getExoArea(ExoAreasEnum.PEOPLE.toString()))
    );
  }

  buildCorePillarToSave() {
    const data = this.form.getRawValue();
    const selected = Object.keys(data)
      .filter(act => data[act] === true)
      .map(code => code);
    return { 'areas' : selected };
  }

  onSubmit() {
    const dataToSend = this.buildCorePillarToSave();
    this.profileEditionService.saveData(
      this.user.pkConsultant,
      dataToSend,
      ApiResources.PROFILE_EDIT_AREAS_USER
    )
      .subscribe(
      data => {
        this.store.dispatch(new profileActions.UpdateUser({ user: this.user, data: { 'exoAreas': dataToSend.areas } }));
        this.isDirty = false;
        this.snackBarService.success();
      },
      () => {
        this.snackBarService.error();
      });
  }

  toggleItem() {
    this.isDirty = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
