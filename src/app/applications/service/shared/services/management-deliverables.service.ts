import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@core/services';
import { Resource, ResourceStatus } from '@ecosystem-media-library/store/resource.model';
import { StepModel as GProjectStepModel  } from '@applications/workspace/projects/models/step.model';

import { Step as StepModel } from '../../old-project/models/step.model';

@Injectable()
export class ManagementDeliverablesService {

  constructor(
    private authHttp: HttpClient,
    private urlService: UrlService
  ) { }

  uploadDeliverable(step: StepModel | GProjectStepModel, fileStackData): Observable<Resource> {
    const url = step instanceof StepModel ?
      this.urlService.resolveAPI(ApiResources.SERVICE_UPLOAD_DELIVERABLE_STEP, step.deliverableStepEndpoint) :
      this.urlService.resolve(ApiResources.GENERIC_PROJECT_UPLOAD_DELIVERABLE_STEP, step.deliverableStepEndpoint);
    const data = {
      filestack_status: fileStackData['status'],
      url: fileStackData['url'],
      filename: fileStackData['filename'],
      mimetype: fileStackData['mimetype']
    };

    return this.authHttp.post<Resource>(url, data).pipe(
      map((response: any) =>
        new Resource(<any>{
          ...response,
          canChangeVisibility: response.canChangeVisibility,
          createdBy: response.createdBy,
          status: ResourceStatus.Available})
    ));
  }

  deleteDeliverable(step: StepModel | GProjectStepModel, resource: Resource): Observable<any> {
    const url = step instanceof StepModel ?
      this.urlService.resolveAPI(
        ApiResources.SERVICE_DELETE_DELIVERABLE_STEP, step.deliverableStepEndpoint, resource.pk) :
      this.urlService.resolve(
        ApiResources.GENERIC_PROJECT_DELETE_DELIVERABLE_STEP, step.deliverableStepEndpoint, resource.pk);
    return this.authHttp.delete(url).pipe(map(() => resource));
  }

  changePrivacyDeliverable(step: StepModel | GProjectStepModel, resource: Resource) {
    const url = step instanceof StepModel ?
      this.urlService.resolveAPI(ApiResources.CHANGE_VISIBILITY_DELIVERABLE_STEP, resource.pk) :
      this.urlService.resolve(ApiResources.GENERIC_PROJECT_CHANGE_VISIBILITY_DELIVERABLE_STEP, resource.pk);
    return this.authHttp.put<StepModel | GProjectStepModel>(url, {});
  }

}
