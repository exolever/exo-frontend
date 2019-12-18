import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { UserModel } from '@app/core';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import * as userActions from '@core/store/user/user.action';
import { StaticPermissions } from '@core/services/acl/permissions';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

@Injectable()
export class ExqGuard implements CanActivate {
  user: UserModel;
  constructor(
    private store: Store<AppState>,
    private promptDialogService: PromptDialogService,
    private translate: TranslateService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkPermissions();
  }

  private checkPermissions (): Observable<boolean> {
    return this.store.pipe(
      select((state) => fromUser.getUser(state)),
      tap(user => {if (!user) { this.store.dispatch(new userActions.GetUser()); } }),
      filter(user => user !== undefined),
      map((user: UserModel) => {
        if (user.isSuperuser || user.hasPermissions(StaticPermissions.CAN_ACCESS_EXQ)) {
          return true;
        }
        this.promptDialogService.open({
          title: this.translate.instant('CERTIFICATES.DIALOG.CONSULTANTS.EXQ_TITLE'),
          extraHTML: this.translate.instant('CERTIFICATES.DIALOG.CONSULTANTS.EXQ_DESCRIPTION'),
          primaryButton: this.translate.instant('COMMON.ACTIONS.CLOSE')
        }).subscribe();
        return false;
      })
    );
  }

}
