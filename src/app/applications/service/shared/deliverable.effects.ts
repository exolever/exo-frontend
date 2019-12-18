import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';

import { PrivacyType, Resource } from '@ecosystem-media-library/store/resource.model';

import * as DeliverablepActions from './deliverable.actions';
import { ManagementDeliverablesService } from './services/management-deliverables.service';

@Injectable()
export class DelivarableEffects {

  @Effect()
  uploadDeliverable$: Observable<Action> = this.actions$.pipe(
    ofType(DeliverablepActions.TypeActionEnum.UPLOAD_DELIVERABLE),
    switchMap((action: DeliverablepActions.UploadDeliverable) =>
      this.deliverableService.uploadDeliverable(action.payload.stepSelected, action.payload.file).pipe(
        map((resource: Resource) => {
          this.snackBar.open(
            this.translator.instant('SERVICE.DELIVER.UPLOAD_SUCCESS'),
            this.translator.instant('COMMON.CLOSE'),
            {panelClass: 'success'}
          );
          return new DeliverablepActions.UploadDeliverableSuccess(resource);
        })
      )
    ),
  );

  @Effect()
  deleteDeliverable$: Observable<Action> = this.actions$.pipe(
    ofType(DeliverablepActions.TypeActionEnum.DELETE_DELIVERABLE),
    switchMap((action: DeliverablepActions.DeleteDeliverable) =>
      this.deliverableService.deleteDeliverable(action.payload.stepSelected, action.payload.file).pipe(
        map((resource: Resource) => {
          this.snackBar.open(
            this.translator.instant('SERVICE.DELIVER.DELETE_SUCCESS'),
            this.translator.instant('COMMON.CLOSE'),
            {panelClass: 'success'}
          );
          return new DeliverablepActions.DeleteDeliverableSuccess(resource);
        })
      )
    ),
  );

  @Effect()
  changeVisibilityDeliverable$ = this.actions$.pipe(
    ofType(DeliverablepActions.TypeActionEnum.CHANGE_DELIVERABLE_PRIVACY),
    switchMap((action: DeliverablepActions.ChangeDeliverablePrivacy) =>
      this.deliverableService.changePrivacyDeliverable(action.payload.stepSelected, action.payload.file).pipe(
      map((r: any) => {
        this.snackBar.open(
          this.translator.instant(r.visibility === PrivacyType.Private ?
            'SERVICE.DELIVER.CHANGE_PRIVATE_SNACKBAR' :
            'SERVICE.DELIVER.CHANGE_PUBLIC_SNACKBAR'),
          this.translator.instant('COMMON.CLOSE'),
          {panelClass: 'success'}
        );
        return new DeliverablepActions.ChangeDeliverablePrivacySuccess({ result: r, pk: action.payload.file.pk });
      })
    )),
  );

  constructor(
    private actions$: Actions,
    private deliverableService: ManagementDeliverablesService,
    private translator: TranslateService,
    private snackBar: MatSnackBar
  ) {
  }

}
