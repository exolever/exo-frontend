import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ProjectService } from '@service/old-project/services/project.service';
import { ProjectModel } from '../models/project.model';
import * as projectActions from '../store/project/projects.actions';

@Injectable()
export class ProjectResolver implements Resolve<ProjectModel> {

  constructor(
    private projectService: ProjectService,
    private store: Store<AppState>,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const pk = route.params['pk'] ? route.params['pk'] : route.params['pkService'];
    return this.projectService.getProjectResolver(pk).pipe(
      tap(project => this.store.dispatch(new projectActions.InitProject(project)))
    );

  }
}
