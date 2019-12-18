
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApolloAuthService, QueryModel } from '@core/services';
import { IResource } from '@resources/shared/models';
import { ResourcesQueryBuilderService } from '../../../shared/services/resources-query-builder.service';


@Injectable()
export class ResourcesService {
  public resources: Array<IResource>;

  constructor(
    private apollo: ApolloAuthService,
    private builder: ResourcesQueryBuilderService
  ) { }

  resourcesQuery() {
    const query = new QueryModel('allProject');
    query.declareFilters({ '$pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });
    const firstNode = query.addSchema();
    this.builder.addResourcesNode(firstNode);

    // Transform the query into Graph syntax
    return query.toGraphQL();
  }

  getResources(pkProject: string): Observable<any> {
    const filtersGraphQL = { 'pk': pkProject };
    const query = this.resourcesQuery();
    return this.apollo.buildWatchQuery(query, filtersGraphQL).pipe(map(result => result.data));
  }

}
