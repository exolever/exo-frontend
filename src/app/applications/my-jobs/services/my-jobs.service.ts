import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResources, UrlService } from '@app/core';
import { Observable } from 'rxjs';

import { Pagination } from '@core/interfaces/pagination.interface';
import { Job } from '../models/job.model';
import { tap } from 'rxjs/operators';

@Injectable()
export class MyJobsService {
  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService
  ) { }

  getMyJobsList(pagination: {pageIndex: number, pageSize: number, searchBy: string}): Observable<Pagination<Job>> {
    let apiUrl = this.urlService.resolveExOJobs(ApiResources.MY_JOBS);
    apiUrl = this.urlService.resolveGetParams(
      apiUrl, ['search', 'page', 'page_size'],
      [`${pagination.searchBy}`, `${pagination.pageIndex}`, `${pagination.pageSize}`]);

    return this.httpClient.get<Pagination<Job>>(apiUrl).pipe(
        tap( (response: Pagination<Job>) => response.results = response.results.map(job => new Job(job)))
      );
  }
}
