import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of as observableOf } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CertificationsService } from '../services';

import * as certificationsActions from './certifications.action';

@Injectable()
export class CertificationsEffect {

  constructor(
    private actions$: Actions,
    private certificationsService: CertificationsService
  ) { }

  @Effect()
  getCertifications$: Observable<Action> = this.actions$.pipe(
    ofType(certificationsActions.GET_CERTIFICATIONS),
    switchMap(() => this.certificationsService.getCertifications().pipe(
      map(certifications => new certificationsActions.GetCertificationsSuccess(certifications)),
      catchError(error => observableOf(new certificationsActions.GetCertificationsFail(error)))
    ))
  );

}
