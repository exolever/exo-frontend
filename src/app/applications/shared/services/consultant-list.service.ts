import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResources, UrlService } from '@core/services';
import { UserPictureModel } from '@core/models/user/user-picture.model';

import { ConsultantModel } from '../models/consultant.model';


@Injectable()
export class ConsultantListService {
  constructor(private urlService: UrlService, private authHttp: HttpClient) {
  }

  getConsultants(consultantName?: string, pageSize?: number): Observable<ConsultantModel[]> {
    const url = this.urlService.resolveAPI(ApiResources.CONSULTANT_AUTOCOMPLETE);
    let params = new HttpParams();
    if (consultantName) {
      params = params.set('search', consultantName);
    }
    if (pageSize) {
      params = params.set('page_size', pageSize.toString());
    }
    return this.authHttp.get(url, {params: params}).pipe(map(res => {
      return this.parseResponse(res);
    }));
  }

  parseResponse(res): Array<ConsultantModel> {
    return res.map(obj => {
      const consultant = new ConsultantModel(obj.user_id);
      consultant.uuid = obj.user_uuid;
      consultant.profileUrl = obj.url_profile;
      consultant.userTitle = obj.user_title;
      consultant.thumbnail = obj.thumbnail;
      consultant.consultantStatus = obj.status;
      consultant.fullName = obj.name;
      consultant.email = obj.email;
      consultant.setPkConsultant(obj.id.toString());
      consultant.profilePictures.push(new UserPictureModel({height: 144, width: 144, url: obj.thumbnail}));
      consultant.certifications = obj.certifications;
      return consultant;
    });
  }
}

