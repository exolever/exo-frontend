import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources, UrlService } from '@core/services';

export const domainPublicProfile = 'https://me.openexo.com/';

@Injectable()
export class ProfileEditionService {

  constructor (
    private authHttp: HttpClient,
    private urlService: UrlService
  ) {}

  updateImageProfile( pk: string, image: File ): Observable<any> {
    // Get the image an base64 string
    const data: any = { profile_picture: image['image'] };
    const url = this.urlService.resolveAPI(ApiResources.PROFILE_EDIT_IMAGE_USER_PROFILE, pk);
    return this.authHttp.put(url, data);
  }

  updateVideoProfile(pk: string, videoUrl: string): Observable<any> {
    const data: any = { video_url: videoUrl };
    const url = this.urlService.resolveAPI(ApiResources.PROFILE_EDIT_VIDEO_USER_PROFILE, pk);
    return this.authHttp.put(url, data);
  }

  /** saves the data of the modified user */
  saveData(idUser: string, data: any, endpoint: string): Observable<any> {
    const url = this.urlService.resolveAPI(endpoint, idUser);
    return this.authHttp.put(url, data);
  }
}
