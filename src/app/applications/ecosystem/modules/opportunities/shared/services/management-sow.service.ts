import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@app/core';

import { SowDeserializerService } from './sow-deserializer.service';

@Injectable()
export class SowService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private sowDeserializerService: SowDeserializerService
  ) { }

  getDataSow(applicantPk: number): Observable<any> {
    const url = this.urlService.resolve(ApiResources.GET_DATA_SOW, applicantPk.toString());
    return this.http.get(url)
      .pipe(map((res) => this.sowDeserializerService.deserialize(res)));
  }
}
