import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Store, select } from '@ngrx/store';

import { WindowRef } from '@app/core';
import { UserModel } from '@core/models/user/user.model';
import { AppState } from '@core/store/reducers';
import * as userActions from '@core/store/user/user.action';
import { IntercomSettings } from '@core/services/intercom/intercom-settings.interface';
import * as fromUser from '@core/store/user/user.reducer';

// list of commands from the Intercom API
enum IntercomCommands {
  boot = 'boot',
  shutdown = 'shutdown',
  update = 'update',
  show = 'show',
  hide = 'hide'
}

@Injectable()
export class IntercomService {
  // config
  defaultVerticalPadding = 20;

  constructor(
    private windowRef: WindowRef,
    private store: Store<AppState>
  ) {}

  bootIntercom(): void {
    this.store.pipe(select(state => fromUser.getUser(state))).subscribe((user: UserModel) => {
      if ( user && user.intercomHash) {
        const Intercom = this.windowRef.nativeWindow.Intercom;
        Intercom( IntercomCommands.boot, this.populateAppConfig(user) );
        this.store.dispatch(new userActions.UpdateLoggedIntercom(true));
      }
    });
  }

  shutdownIntercom(): void {
    const Intercom = this.windowRef.nativeWindow.Intercom;

    Intercom( IntercomCommands.shutdown );
    this.store.dispatch(new userActions.UpdateLoggedIntercom(false));
  }

  isIntercomBooted(): boolean {
    return this.windowRef.nativeWindow.Intercom.booted;
  }

  populateAppConfig( user: UserModel ): IntercomSettings {
    const user_location = user.location ? user.location : 'No location response received, contact support';
    return {
      app_id: environment.INTERCOM_APP_ID,
      email: user.email,
      name: user.fullName,
      user_id: user.pk,
      user_hash: user.intercomHash,
      vertical_padding: this.defaultVerticalPadding,
      'company': user.company,
      'groups': user.groups,
      'is_active': user.isActive,
      'is_superuser': user.isSuperuser,
      'isStaff': user.isStaff,
      'language': user.language,
      'phone': user.phone,
      'pkConsultant': user.pkConsultant,
      'projects': user.projects,
      'segment': user.segment,
      'short_me': user.shortMe,
      'status': user.status,
      'location': user_location,
      'timezone': user.timezone,
      'activities': user.activities.map(act => act.name).join(', '),
      'certificates': user.certifications.map(c => c.name).join(', ')
    };
  }

}
