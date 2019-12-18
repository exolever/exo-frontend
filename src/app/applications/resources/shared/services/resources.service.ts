import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UrlService, ApiResources } from '@core/services/api/';

import { IResource } from '../models/';


@Injectable()
export class ResourcesService {
  constructor(private authHttp: HttpClient, private urlService: UrlService) { }

  public upload(dataSend: Array<any>): Observable<Object> {
    const formData = new FormData();
    dataSend.map(data => formData.append(data.name, data.data));
    const url = this.urlService.resolveAPI(ApiResources.USER_RESOURCE_UPLOAD);
    return this.authHttp.post(url, formData);
  }

  public deleteTags(resource: IResource, slugs: Array<string>): Observable<Object> {
    const url = this.urlService.resolveAPI(ApiResources.USER_RESOURCE_REMOVE, resource.pk);
    return this.authHttp.put(url, { 'name': this.reduceSlugs(slugs)});
  }

  public addTags(resource: IResource, slugs: Array<string>): Observable<Object> {
    const url = this.urlService.resolveAPI(ApiResources.USER_RESOURCE_UNDO, resource.pk);
    return this.authHttp.put(url, { 'name': this.reduceSlugs(slugs)});
  }

  public reduceSlugs(slugs: Array<any>) {
    return slugs.join(',').trim();
  }
}
