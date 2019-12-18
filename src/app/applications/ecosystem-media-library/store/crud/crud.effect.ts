import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of as observableOf, EMPTY as empty } from 'rxjs';
import { map, switchMap, catchError, filter } from 'rxjs/operators';

import {
  PromptDialogService
} from '@shared/modules/prompt-dialog/prompt-dialog.service';

import {
  PromptDataInterface
} from '@shared/modules/prompt-dialog/prompt-dialog.interface';

import { ResourcesService } from '../../services/resources.service';
import { Resource } from '../resource.model';
import * as CrudActions from './crud.actions';

@Injectable()
export class CrudEffects {
  private config: PromptDataInterface;

  @Effect()
  uploading$: Observable<Action> = this.actions$.pipe(
    ofType(CrudActions.UPLOAD),
    switchMap((action: CrudActions.Upload) => this.resourcesService.upload(action.payload).pipe(
      map((resource: Resource) => {
        if (resource.internal) {
          this.snackBar.open(
            this.translate.instant('MEDIA.FORM.UPLOAD_SUCCESS'), this.translate.instant('NOTIFICATION.CLOSE'));
        }
        return new CrudActions.UploadSuccess(resource);
      }),
      catchError(error => observableOf(new CrudActions.UploadError()))
    )),
  );

  @Effect()
  uploadingNotification$: Observable<Action> = this.actions$.pipe(
    ofType(CrudActions.UPLOAD_SUCCESS_NOTIFICATION),
    map((action: CrudActions.UploadSuccessNotification) => action.payload),
    switchMap((resource: Resource) => {
      if (!resource.internal) {
        this.snackBar.open(
          this.translate.instant('MEDIA.MESSAGES.UPLOAD_SUCCESS'), this.translate.instant('NOTIFICATION.CLOSE'));
      }
      return empty;
    })
  );

  @Effect()
  updateSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(CrudActions.UPDATE_SUCCESS),
    map((action: CrudActions.UpdateSuccess) => action.payload),
    switchMap((resource: Resource)  => {
      this.snackBar.open(
        this.translate.instant('MEDIA.FORM.UPDATE_SUCCESS'), this.translate.instant('NOTIFICATION.CLOSE'));
      return empty;
    })
  );

  @Effect()
  updating$: Observable<Action> = this.actions$.pipe(
    ofType(CrudActions.UPDATE),
    switchMap((action: CrudActions.Update) => this.resourcesService.update(action.payload).pipe(
      map((resource: Resource)  => {
        this.snackBar.open(
          this.translate.instant('MEDIA.FORM.UPDATE_SUCCESS'), this.translate.instant('NOTIFICATION.CLOSE'));
        return new CrudActions.UpdateSuccess(resource);
      }),
      catchError(error => observableOf(new CrudActions.UpdateError()))
    )),
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$.pipe(
    ofType(CrudActions.DELETE),
    switchMap( (action: CrudActions.Delete) =>
      this.promptDialog.open(this.config).pipe(
        filter(r => r === true),
        switchMap(() => observableOf(action) )
      )
    ),
    switchMap((action: CrudActions.Delete) => this.resourcesService.delete(action.payload).pipe(
      map((resource: Resource)  => {
        this.snackBar.open(
          this.translate.instant('MEDIA.FORM.DELETE_SUCCESS'), this.translate.instant('NOTIFICATION.CLOSE'));
        return new CrudActions.DeleteSuccess(resource);
      }),
      catchError(error =>  observableOf(new CrudActions.DeleteError()) )
    )),
  );
  constructor(
    private snackBar: MatSnackBar,
    private promptDialog: PromptDialogService,
    private translate: TranslateService,
    private actions$: Actions,
    private resourcesService: ResourcesService
  ) {
    this.config = {
      title: this.translate.instant('MEDIA.DELETE_DIALOG.TITLE'),
      messages: [this.translate.instant('MEDIA.DELETE_DIALOG.MESSAGE')],
      primaryButton: this.translate.instant('MEDIA.DELETE_DIALOG.ACTION'),
      secondaryButton: this.translate.instant('COMMON.CANCEL')
    };
  }
}


