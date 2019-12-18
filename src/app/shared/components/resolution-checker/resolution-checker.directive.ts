import { AfterViewInit, Directive, OnInit } from '@angular/core';
import { WindowRef } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { SessionStorageService } from '@core/services/sessionStorage.service';

export const MIN_RESOLUTION = 360;

@Directive({
  selector: '[resolutionChecker]',
  providers: []
})

export class ResolutionCheckerDirective implements OnInit, AfterViewInit {

  showDialog: boolean;

  constructor(
    public w: WindowRef,
    private session: SessionStorageService,
    private translate: TranslateService,
    private promptDialog: PromptDialogService
  ) {
  }

  ngOnInit() {
    const shown = this.session.getItem('resolution');
    if (!shown && this.w.nativeWindow.innerWidth < MIN_RESOLUTION) {
      this.showDialog = true;
    }
  }

  ngAfterViewInit() {
    if (this.showDialog) {
      this.openDialog();
    }
  }

  openDialog() {
    this.markAsShown();
    return this.promptDialog.open({
      title: this.translate.instant('RESOLUTION.TITLE'),
      messages: [this.translate.instant('RESOLUTION.MESSAGE1'), this.translate.instant('RESOLUTION.MESSAGE2')],
      primaryButton: this.translate.instant('SHARED.OK')
    });
  }

  private markAsShown() {
    this.session.setItem('resolution', this.w.nativeWindow.innerWidth);
  }
}
