import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

const BaseApiUrl = 'api/';

@Injectable()
export class UrlService {

  getPath(params: Array<string | number>): string {
    if (!params.length) { console.log('wrong arguments to setUrls'); }

    // Clone to create a new reference Array instead using the same reference to prevent update the array with the slice
    // and modify the real params.
    const cloneParams = [...params];
    let url = cloneParams.slice(0, 1)[0].toString();
    cloneParams.splice(1).map(url_param => {
      url = url.replace(/%s/, url_param.toString());
    });

    return url;
  }

  resolveAPI(...params: Array<any>) {
    const url = this.getPath(params.map(param => param.toString()));
    return environment['baseUrl'].concat(BaseApiUrl.concat(url));
  }

  resolve(...params: Array<any>) {
    const url = this.getPath(params.map(param => param.toString()));
    return environment['baseUrl'].concat(url);
  }

  resolveGetParams(url: string, params: Array<string>, values: Array<string | number>): string {
    params.map((param, i) => {
      const value = values[i].toString();
      const paramToConcat = i === 0 ? '?' + param + '=' + value : '&' + param + '=' + value;
      return url = url.concat(paramToConcat);
    });
    return url;
  }

  resolveExOJobs(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['exoJobsBaseUrl'].concat(url);
  }

  resolveExOAuth(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['exoAuthBaseUrl'].concat(url);
  }

  resolveEvents(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['exoEventsBaseUrl'].concat(BaseApiUrl.concat(url));
  }

  resolveExQ(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['exoExQBaseUrl'].concat(BaseApiUrl.concat(url));
  }

  resolveMediaLibrary(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['exoMediaLibraryBaseUrl'].concat(url);
  }

  resolveConversationsApi(...params: Array<string>) {
    const url = this.getPath(params);
    const urlApi = 'conversations/';
    return urlApi.concat(BaseApiUrl.concat(url));
  }

  /****************
   *  Websockets  *
   ***************/
  resolveWebsocket(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['websocketServerBaseUrl'].concat(url);
  }

  resolveWebsocketMedialibrary(...params: Array<string>) {
    const url = this.getPath(params);
    return environment['wsServerMediaLibraryBaseUrl'].concat(url);
  }

  resolveWsNotifications() {
    return environment['wsNotifications'];
  }

}
