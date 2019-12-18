import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentNode } from 'graphql';

import { ApolloAuthService, QueryModel } from '@core/services';
import { UserQueryBuilderService, ConsultantQueryBuilderService } from '@applications/shared/services';

@Injectable()
export class TeamService {

  constructor (
    private apollo: ApolloAuthService,
    private builder: UserQueryBuilderService,
    private consultantBuilder: ConsultantQueryBuilderService
  ) {}

  private membersQuery(fromPlatform = false): DocumentNode {
    const query = new QueryModel('allProject');
    query.declareFilters({ '$pk': 'String' });
    query.applyFilter({ 'pk': '$pk' });
    const firstNode = query.addSchema();

    const nodeConsultanstRoles = firstNode.addMultipleNode('consultantsRoles');
    const role = nodeConsultanstRoles.addSingleNode('exoRole');
    role.addFields(['code', 'name']);

    // consultant node
    const consultantNode = nodeConsultanstRoles.addSingleNode('consultant');
    consultantNode.addField('pk');
    if (!fromPlatform) {
      this.consultantBuilder.addIndustriesNode(consultantNode);
      this.consultantBuilder.addLanguagesNode(consultantNode);
      this.builder.addUserNode(consultantNode);

      // usersRoles
      const nodeUsersRoles = firstNode.addMultipleNode('usersRoles');
      nodeUsersRoles.addFields(['status']);
      nodeUsersRoles.addSingleNode( 'exoRole' ).addFields( ['code', 'name' ]);
      const userRoleNode = nodeUsersRoles.addSingleNode('user');
      userRoleNode.addFields(['pk', 'fullName', 'aboutMe', 'bioMe', 'Position', 'shortMe', 'shortName', 'slug']);
      const profileUserRole = userRoleNode.addSingleNode('profilePictures');
      profileUserRole.addFields(['width', 'height', 'url']);
    }

    if (fromPlatform) {
      this.builder.addDirectoryUserNode(consultantNode);

      // usersRoles
      const nodeUsersRoles = firstNode.addMultipleNode('usersRoles');
      nodeUsersRoles.addFields(['status']);
      nodeUsersRoles.addSingleNode( 'exoRole' ).addFields( ['code', 'name' ]);
      const userRoleNode = nodeUsersRoles.addSingleNode('user');
      userRoleNode.addFields(['pk', 'fullName', 'shortName', 'slug']);
      const profileUserPicture = userRoleNode.addSingleNode('profilePictures');
      profileUserPicture.addFields(['width', 'height', 'url']);
    }

    // teams
    const nodeTeams = firstNode.addMultipleNode('teams');
    nodeTeams.addFields(['pk', 'name']);
    const nodeCoach = nodeTeams.addSingleNode('coach');
    nodeCoach.addField('pk');
    const nodeTeamMembers = nodeTeams.addMultipleNode('teamMembers');
    nodeTeamMembers.addField('pk');

    // Transform the query into Graph syntax
    return query.toGraphQL();
  }

  getMembers(pkProject: string): Observable<any> {
    const filtersGraphQL = { 'pk': pkProject };
    const query = this.membersQuery();

    // TODO: REFACTOR AND RETURN AN ARRAY OF ITEM
    return this.apollo.buildWatchQuery(query, filtersGraphQL).pipe(map(result => result.data));
  }

  /**
   * Get Members within a project.
   * @param {string} pkProject
   * @returns {Observable<any>}
   */
  getPlatformMembers(pkProject: string): Observable<any> {
    const filtersGraphQL = { 'pk': pkProject };
    const fromPlatform = true;
    // We don't need some data in the platform to show directories-profile-card
    const query = this.membersQuery(fromPlatform);

    return this.apollo.buildWatchQuery(query, filtersGraphQL).pipe(map(result => {
      if (result.data && result.data.allProject) {
        return result.data.allProject.edges[0].node;
      }
    }));
  }
}
