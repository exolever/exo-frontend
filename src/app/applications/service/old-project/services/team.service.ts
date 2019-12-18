import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryModel, ApolloAuthService } from '@core/services';
import { TeamModel } from '@service/old-project/models/team.model';


@Injectable()
export class TeamService {

  constructor(
    private apollo: ApolloAuthService
  ) {}

  getTeams(pkProject?: string): Observable<TeamModel[]> {
    const filtersGraphQL = pkProject ? {'pk' : pkProject } : {};
    const query = this.getTeamsQuery();

    return this.apollo.buildQuery( query, filtersGraphQL).pipe(
      map(response => response['data'].allProject.edges),
      map((obj: any[]) => obj.map(item => item.node.myTeams.edges)),
      map((obj: any[]) => [].concat.apply([], obj)), // flattering arrays
      map((dataTeams: any []) => dataTeams.map(data => this.parseObject(data.node)))
    );
  }

  private getTeamsQuery() {
    const query = new QueryModel('allProject');
    query.declareFilters({ '$pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });

    const firstNode = query.addSchema();

    const myTeamsNode = firstNode.addMultipleNode('myTeams');
    myTeamsNode.addFields(['pk', 'name', 'zoomUrl', 'stream', 'permissions', 'groupUuid']);

    // Transform the query into Graph syntax
    return query.toGraphQL();
  }

  private parseObject(obj: any): TeamModel {
    return new TeamModel({
      pk: obj.pk,
      name: obj.name,
      zoomUrl: obj.zoomUrl,
      stream: obj.stream,
      permissions: obj.permissions,
      groupUuid: obj.groupUuid
    });
  }
}
