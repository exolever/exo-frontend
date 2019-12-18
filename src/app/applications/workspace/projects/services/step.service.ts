import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as MomentTZ from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources as ApiUrls, UrlService } from '@app/core';

import { StepModel } from '../models/step.model';


@Injectable()
export class StepService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getSteps(projectPk: number): Observable<StepModel[]> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_STEPS, projectPk);
    return this.http.get(apiUrl).pipe(map((response: StepModel[]) => response.map(
      res => new StepModel(res)
    )));
  }

  editStep(step: StepModel, projectPk: number): Observable<StepModel> {
    const dataFormated = {
      ...step,
      ...{start: MomentTZ(step.start).format('YYYY-MM-DD')}
    };
    delete dataFormated['end'];
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_STEP_DETAIL, projectPk, step.pk);
    return this.http.put<StepModel>(apiUrl, dataFormated).pipe(
      map(response => new StepModel(response))
    );
  }

}
