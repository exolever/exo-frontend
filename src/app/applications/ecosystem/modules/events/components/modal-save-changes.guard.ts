import { Component, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { tap, map } from 'rxjs/operators';
import { Subject, of as observableOf } from 'rxjs';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

@Injectable()
export class EventEditionGuard implements CanDeactivate<Component> {
  result$: Subject<any> = new Subject();
  constructor(
    private translate: TranslateService,
    private promptDialog: PromptDialogService
  ) {}

  canDeactivate(component: Component) {
    if (component['formComponent'].form.dirty) {
      return this.promptDialog.open({
        title: this.translate.instant('GUARDS.CANDEACTIVATE.LEAVE_TITLE'),
        messages: [this.translate.instant('GUARDS.CANDEACTIVATE.LEAVE_MESSAGE')],
        secondaryButton: this.translate.instant('GUARDS.CANDEACTIVATE.LEAVE'),
        primaryButton: this.translate.instant('GUARDS.CANDEACTIVATE.STAY')
        }).pipe(
        tap((result) => this.result$.next(result)),
        map((res) => !res)
      );
    }
    return observableOf(true).pipe(tap(() => this.result$.next(false)));
  }
}

