import { Component, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

@Injectable()
export class OpportunitiesGuard implements CanDeactivate<Component> {
  constructor(
    private translate: TranslateService,
    private promptDialog: PromptDialogService
  ) {}

  canDeactivate(component) {
    if (component.formComponent && component.formComponent['checkCanExist']) {
      return this.promptDialog.open({
        title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.EXIT_WITHOUT_SAVE.TITLE'),
        messages: [this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.EXIT_WITHOUT_SAVE.MESSAGE')],
        secondaryButton: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.EXIT_WITHOUT_SAVE.LEAVE'),
        primaryButton: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.EXIT_WITHOUT_SAVE.STAY')
      }, true).pipe(map(stayInPage => {
        return stayInPage ? false : true;
      }));
    }
    return true;
  }
}
