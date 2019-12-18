import { UrlService } from '@app/core';

export class UrlServiceStub {
  resolve() { }
  resolveAPI() {
    return '/fakeUrl/';
  }
  resolveWebsocket() {
    return '';
  }
  resolveMediaLibrary() {
    return '';
  }
  resolveGetParams() {
    return '';
  }
  resolveWebsocketMedialibrary() {
    return '';
  }

  getPath() {
    return '';
  }
}

export const URL_SERVICE_STUB_PROVIDER = { provide: UrlService, useClass: UrlServiceStub };
