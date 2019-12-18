import { AfterViewInit, Directive, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { SessionStorageService } from '@core/services/sessionStorage.service';

const BROWSERS = [{
  browser: 'Opera', version: 100, fullSupport: false
}, {
  browser: 'Chrome', version: 49, fullSupport: false
}, {
  browser: 'Firefox', version: 39, fullSupport: false
}, {
  browser: 'Edge', version: 1, fullSupport: true
}, {
  browser: 'IE', version: 11, fullSupport: false
}, {
  browser: 'Safari', version: 10, fullSupport: false
}];

@Directive({
  selector: '[versionChecker]',
  providers: []
})
export class VersionCheckerDirective implements OnInit, AfterViewInit {

  showDialog: boolean;
  browserVersion: string;

  constructor(
    private session: SessionStorageService,
    private translate: TranslateService,
    private promptDialog: PromptDialogService
  ) {
  }

  ngOnInit() {
    this.browserVersion = this.getBrowserVersion();
    const shown = this.session.getItem('browserVersion');
    if (!shown && this.unsupportedBrowser(this.browserVersion)) {
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
      title: this.translate.instant('BROWSER_VERSION.TITLE'),
      messages: [this.translate.instant('BROWSER_VERSION.MESSAGE')],
      extraHTML: this.translate.instant('BROWSER_VERSION.DESCRIPTION', { url: 'https://browsehappy.com/?locale=en' }),
      primaryButton: this.translate.instant('SHARED.OK')
    });
  }

  unsupportedBrowser(browser: string) {
    const current = browser.split(' ');
    const obj = BROWSERS.filter(br => br.browser === current[0])[0];
    return (!obj.fullSupport && (obj.version > parseInt(current[1], 10)));
  }

  private getBrowserVersion() {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return M.join(' ');
  }

  private markAsShown() {
    this.session.setItem('browserVersion', this.browserVersion);
  }
}
