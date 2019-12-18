
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

import { AppState } from '@core/store/reducers';
import * as fromService from '../store/reducers';
import * as teamActions from '../store/teams/team.action';
import { TeamModel } from '../models/team.model';

@Injectable()
export class TeamResolver implements Resolve<TeamModel> {
  constructor(private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot): Observable<TeamModel> {
    return this.store.pipe(
      select(fromService.getTeamSelected),
      tap(teamSelected => {
        if (!teamSelected) {
          this.store.dispatch(new teamActions.SetTeamSelected(route.params.pkTeam));
          this.store.dispatch(new teamActions.LoadTeams(route.params.pkService));
        }
      }),
      filter(teamSelected => teamSelected !== undefined),
      take(1)
    );
  }
}

