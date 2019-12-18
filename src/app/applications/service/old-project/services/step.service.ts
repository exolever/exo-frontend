import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Step} from '@service/old-project/models/step.model';
import {ApiResources, UrlService} from '@core/services';
import { Resource } from '@applications/ecosystem-media-library/store/resource.model';

@Injectable()
export class StepService {

  showHeader = new BehaviorSubject<boolean>(true);
  public assignmentHeader$ = this.showHeader.asObservable();

  constructor(
    private authHttp: HttpClient,
    private urlService: UrlService
  ) {
  }

  /**
   * Get Steps collection
   *
   * @param pkProject
   * @param pkTeam
   */
  getSteps(pkProject: string, pkTeam: string): Observable<Step[]> {
    const url = this.urlService.resolveAPI(ApiResources.SERVICE_STEPS, pkProject, pkTeam);
    return this.authHttp.get<Step[]>(url).pipe(
      map(response => response.map(obj => new Step({
          pk: obj.pk,
          name: obj.name,
          start: obj.start,
          end: obj.end,
          current: obj.current,
          assignments: [],
          hasAssignments: obj.hasAssignments,
          index: obj.index
        })
      ))
    );
  }

  /**
   * Get step entity
   *
   * @param pkProject
   * @param pkTeam
   * @param pkStep
   */
  getStep(pkProject: string, pkTeam: string, pkStep: string): Observable<Step> {
    const url = this.urlService.resolveAPI(ApiResources.SERVICE_STEP, pkProject, pkTeam, pkStep);
    return this.authHttp.get<Step>(url).pipe(
      map(response => new Step(response))
    );
  }

  showAssignmentHeader(): void {
    this.showHeader.next(true);
  }

  hideAssignmentHeader(): void {
    this.showHeader.next(false);
  }

  changePrivacy(resource: Resource) {
    const url = this.urlService.resolveAPI(ApiResources.CHANGE_VISIBILITY_DELIVERABLE_STEP, resource.pk);
    return this.authHttp.put<Step>(url, {});
  }

}
