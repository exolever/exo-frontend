import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { HttpClient } from '@angular/common/http';
import { ApiResources, UrlService } from '@core/services/api/resolve';
import {
  IConsultantBackendResponse,
  IUserApplicationBackendResponse
} from '@applications/shared/interfaces/user-consultant-backend-response.interface';
import { ConsultantModel, UserApplicationModel } from '@applications/shared/models';

import { UserAndConsultantResponseDigestService } from '../services/user-and-consultant-response-digest.service';
import * as profileActions from './user-profile.actions';

@Injectable()
export class ProfileEffect {
  @Effect() loadUser$: Observable<Action> = this.actions$
    .pipe(
      ofType(profileActions.ProfileActionEnum.LOAD_USER),
      switchMap((param: {payload: string, type: string}) => {
        return this.http.get<any>(this.urlService.resolveAPI( ApiResources.PLATFORM_PROFILE_VIEW, param.payload ));
      }),
      switchMap((res: IUserApplicationBackendResponse | IConsultantBackendResponse) => {
        if ((<IConsultantBackendResponse>res).consultant) {
            return observableOf(new ConsultantModel(
              res.pk,
              this.userProfileRequestService
                .digestAndBuildConsultantDataFromProfileRequestResponse(<IConsultantBackendResponse>res)
            )).pipe(
              map((digestedRes: UserApplicationModel | ConsultantModel) =>
                new profileActions.LoadUserSuccess(digestedRes)),
              catchError(error => observableOf(new profileActions.LoadUserFail(error)))
            );
        } else {
            return observableOf(new UserApplicationModel(
              res.pk,
              this.userProfileRequestService
                .digestResponseAndBuildUserApplicationData(res)
            )).pipe(
              map((digestedRes: UserApplicationModel | ConsultantModel) =>
                new profileActions.LoadUserSuccess(digestedRes)),
              catchError(error => observableOf(new profileActions.LoadUserFail(error)))
            );
        }
      }),
    );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private urlService: UrlService,
    private userProfileRequestService: UserAndConsultantResponseDigestService
  ) {}



}
