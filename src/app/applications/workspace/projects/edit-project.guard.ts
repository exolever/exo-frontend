import { Component, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { map } from 'rxjs/operators';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';

@Injectable()
export class ProjectEditionGuard implements CanDeactivate<Component> {

  constructor(
    private promptDialogService: PromptDialogService,
    private translate: TranslateService,
  ) {}

  canDeactivate(component: any) {
    if (component['isDirty']) {
      return this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.EDIT.GUARD.TITLE'),
        messages: [this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.EDIT.GUARD.DESCRIPTION')],
        secondaryButton: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.EDIT.GUARD.LEAVE'),
        primaryButton: this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.EDIT.GUARD.STAY')
      }).pipe(map(stayInPage => stayInPage ? false : true));
    }
    return true;
  }
}
