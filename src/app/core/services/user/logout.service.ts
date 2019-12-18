import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WindowRef, LocalStorageService, Urls, UrlService, ApiResources } from '@core/services';
import { IntercomService } from '@core/services/intercom/intercom.service';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '@core/services/sessionStorage.service';

@Injectable()
export class LogoutService {

  constructor(
    private router: Router,
    private urlService: UrlService,
    private httpClient: HttpClient,
    private intercom: IntercomService,
    private localStorageService: LocalStorageService,
    private session: SessionStorageService,
    private w: WindowRef
  ) { }

  logout(): Observable<Object> {
    const apiUrl = this.urlService.resolveAPI(ApiResources.LOGOUT);
    return this.httpClient.post(apiUrl, {}).pipe(
      finalize(() => this.cleanData())
    );
  }

  private cleanData() {
    const url = this.urlService.getPath([Urls.LOGIN]);
    this.intercom.shutdownIntercom();
    this.localStorageService.clean();
    this.session.clear();
    this.w.nativeWindow.sessionStorage.clear();
    this.router.navigate([url]);
  }
}

