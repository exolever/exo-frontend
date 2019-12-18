import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { DocumentNode } from 'graphql';
import { map } from 'rxjs/operators';

import { QueryModel, ApolloAuthService } from '@core/services';

import { DeserializerProjectService } from './project-deserializer.service';
import { ProjectModel } from '../models/project.model';


@Injectable()
export class ProjectService {
  public project$ = new BehaviorSubject<ProjectModel>(null);

  constructor(
    private apollo: ApolloAuthService,
    private deserializer: DeserializerProjectService,
  ) { }

  private getProjectResolverQueryByPk(): DocumentNode {
    const query = new QueryModel('allProject');
    query.declareFilters({ '$pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });

    const firstNode = query.addSchema();
    firstNode.addFields(['name', 'pk', 'typeProject', 'settings', 'uuid']);
    return query.toGraphQL();
  }

  private getProjectQuery() {
    const query = new QueryModel('allProject');
    query.declareFilters({ '$pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });

    const firstNode = query.addSchema();

    firstNode.addFields([
      'pk', 'name', 'typeProject', 'nextUrl', 'location', 'timezone', 'settings', 'hasSwarmSession', 'uuid', 'template'
    ]);
    firstNode.addSingleNode('customer').addField('name');
    firstNode.addMultipleNode('steps').addField('pk');
    firstNode.addMultipleNode('myTeams').addFields(['pk', 'groupUuid']);
    // users roles node
    const usersRolesNode = firstNode.addMultipleNode( 'usersRoles' );
    usersRolesNode.addSingleNode( 'exoRole' ).addField( 'code' );
    usersRolesNode.addSingleNode( 'user' ).addFields(['pk', 'fullName']);
    // consultants roles node
    const consultantsRolesNode = firstNode.addMultipleNode( 'consultantsRoles' );
    consultantsRolesNode.addSingleNode( 'exoRole' ).addFields(['code', 'name']);
    consultantsRolesNode.addSingleNode( 'consultant' )
      .addSingleNode('user')
      .addField('pk');

    // Transform the query into Graph syntax
    return query.toGraphQL();
  }

  /** on update project or team */
  updateProject$(project: ProjectModel) {
    this.project$.next(project);
  }

  getProjectResolver(pk: string): Observable<any> {
    const filtersGraphQL = { 'pk': pk };
    const query = this.getProjectResolverQueryByPk();
    return this.apollo.buildQuery( query, filtersGraphQL ).pipe(map( obj => {
      if ( obj.data['allProject'].edges.length ) {
        const project = this.deserializer.parseResolverResponseGraphQL( obj.data['allProject'].edges[0].node );
        this.updateProject$(project);
        return project;
      }
    }));
  }

  getProject(pk?: string): Observable<ProjectModel[]> {
    const filtersGraphQL = pk ? { 'pk': pk } : {};
    const query = this.getProjectQuery();
    return this.apollo.buildQuery(query, filtersGraphQL).pipe(
      map(serviceResponse => {
        return serviceResponse['data'].allProject.edges.map(project => {
          return this.deserializer.parseProjectGraphResponse(project.node);
        });
      })
    );
  }


}
