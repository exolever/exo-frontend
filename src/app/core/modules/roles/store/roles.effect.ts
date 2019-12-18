import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RolesService } from '@core/modules/roles/services/roles.service';

import * as rolesActions from './roles.action';

@Injectable({
  providedIn: 'root'
})
export class RolesEffect {
  constructor(
    private actions$: Actions,
    private rolesService: RolesService,
  ) { }

  @Effect()
  getRoles$: Observable<Action> = this.actions$.pipe(
    ofType(rolesActions.GET_ROLES),
    switchMap(() => this.rolesService.getRoles().pipe(
      map(certifications => new rolesActions.GetRolesSuccess(certifications)),
      catchError(error => of(new rolesActions.GetRolesFail(error)))
    ))
  );

}
