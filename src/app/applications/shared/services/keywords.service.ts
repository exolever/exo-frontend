import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@core/services';

import { KeywordModel } from '../models/keyword.model';

@Injectable()
export class KeywordService {
  private url: string;

  constructor(private urlService: UrlService, private authHttp: HttpClient) {
    this.url = this.urlService.resolveAPI(ApiResources.KEYWORD_LIST);
  }

  getKeywords(url = this.url): Observable<Array<KeywordModel>> {
    return this.authHttp.get<Object[]>(url).pipe(map(res => {
      return this.parseResponse(res);
    }));
  }

  getKeywordsProfile(tags: Array<string> = []): Observable<Array<KeywordModel>> {
    const url = this.urlService.resolveGetParams(this.url, ['tags'], ['profile']);
    return this.getKeywords(url);
  }

  getKeywordsExpertise(tags: Array<string> = []): Observable<Array<KeywordModel>> {
    const url = this.urlService.resolveGetParams(this.url, ['tags'], ['expertise']);
    return this.getKeywords(url);
  }

  getKeywordsTechnologies(tags: Array<string> = []): Observable<Array<KeywordModel>> {
    const url = this.urlService.resolveGetParams(this.url, ['tags'], ['technology']);
    return this.getKeywords(url);
  }

  parseResponse(res): Array<KeywordModel> {
    return res.results.map(keyword => {
      const k = new KeywordModel(keyword.text);
      keyword.pk ? k.setPk(keyword.pk) : k.setPk(keyword.id);
      return k;
    });
  }
}
