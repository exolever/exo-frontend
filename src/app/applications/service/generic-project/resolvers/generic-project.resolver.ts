import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { filter, tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { AppState } from '@core/store/reducers';

import * as gProjectActions from '../store/actions/generic-project.action';
import * as fromGProject from '../store/reducer';

@Injectable()
export class GenericProjectResolver implements Resolve<GenericProject> {

  constructor(
    private store: Store<AppState>,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<GenericProject> {
    return this.store.pipe(
      select(state => fromGProject.selectSelectedGProject(state.genericProject)),
      tap(gProjectSelected => {
        if (!gProjectSelected) {
          this.store.dispatch(new gProjectActions.GetGProject(+route.params.pkService));
        } else {
          this.store.dispatch(new gProjectActions.InitGProject(gProjectSelected));
        }
      }),
      filter(gProjectSelected => gProjectSelected !== undefined),
      take(1)
    );
  }
}
