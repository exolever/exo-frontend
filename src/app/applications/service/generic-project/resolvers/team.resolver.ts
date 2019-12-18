
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

import { AppState } from '@core/store/reducers';
import { Team as TeamModel} from '@applications/workspace/projects/models/team.model';

import * as fromGProjectService from '../store/reducer';
import * as teamActions from '../store/actions/teams.actions';

@Injectable()
export class TeamResolver implements Resolve<TeamModel> {
  constructor(private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot): Observable<TeamModel> {
    return this.store.pipe(
      select(state => fromGProjectService.selectTeamSelected(state.genericProject)),
      tap(teamSelected => {
        if (!teamSelected) {
          this.store.dispatch(new teamActions.SetGProjectTeamSelected(route.params.pkTeam));
        }
      }),
      filter(teamSelected => teamSelected !== undefined),
      take(1)
    );
  }
}

