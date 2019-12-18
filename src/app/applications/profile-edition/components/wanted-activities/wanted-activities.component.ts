import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ApiResources } from '@core/services';
import { ActivitiesFormService } from '@applications/shared/services/activities-form.service';
import { ActivityModel } from '@applications/shared/models/activity.model';
import { ExOActivityStatusEnum } from '@applications/shared/enums/exo-activity-status.enum';
import { ConsultantModel } from '@applications/shared/models';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as profileActions from '@applications/profile/store/user-profile.actions';
import { getValueEnum } from '@shared/helpers/enum.helper';

import { ProfileEditSnackBarService } from '../../services/snack-bar.service';

@Component({
  templateUrl: './wanted-activities.component.html',
  styleUrls: ['./wanted-activities.component.scss']
})
export class WantedActivitiesComponent implements OnInit, OnDestroy {

  form = this.fb.group({});
  activitiesList: ActivityModel[];

  user: ConsultantModel;
  isDirty = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private profileEditionService: ProfileEditionService,
    private activitiesService: ActivitiesFormService,
    private snackBarService: ProfileEditSnackBarService
  ) { }

  ngOnInit() {
    this.subscription.add(
      this.store.pipe(select(state => fromProfile.getProfileUser(state)))
        .subscribe((profileUser: ConsultantModel) => {
          if (profileUser) {
            this.user = profileUser;
            this.buildForm();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildForm(): void {
    this.activitiesService.getActivities().subscribe((activities: ActivityModel[]) => {
      this.activitiesList = activities;
      this.activitiesList.map(
        activity => {
          this.form.addControl(
            activity.code,
            new FormControl(this.isSelected(activity))
          );
        }
      );
    });
  }

  buildDataToSave() {
    const data = this.form.getRawValue();
    const selected = Object.keys(data).filter(act => data[act] === true).map(code => code);
    return { 'exo_activities': selected };
  }

  buildDataUpdateUser(selectedActivities: { status: string, code: string }[]) {
    const activeStatus = getValueEnum(ExOActivityStatusEnum, ExOActivityStatusEnum.A);
    const data = this.activitiesList
      .filter((ac: ActivityModel) => selectedActivities.find(a => a.status === activeStatus && ac.code === a.code))
      .map((a: ActivityModel) => {
        a.status = activeStatus;
        return new ActivityModel(a.name, a.status, a.code);
      });
    return { 'activities': data };
  }

  onSubmit() {
    this.profileEditionService.saveData(
      this.user.pkConsultant,
      this.buildDataToSave(),
      ApiResources.PROFILE_EDIT_ACTIVITIES_USER
    ).subscribe(
      data => {
        const dataToUpdateUser = this.buildDataUpdateUser(data.exo_activities);
        this.store.dispatch(new profileActions.UpdateUser({ user: this.user, data: dataToUpdateUser }));
        this.isDirty = false;
        this.snackBarService.success();
      },
      () => {
        this.snackBarService.error();
      }
    );
  }

  isSelected(activity: ActivityModel): boolean {
    const exoActivity = this.user.activities.find(
      act => act.code === activity.code);
    return ((exoActivity !== undefined) && (exoActivity.isActive()));
  }

  toggleItem() {
    this.isDirty = true;
  }
}
