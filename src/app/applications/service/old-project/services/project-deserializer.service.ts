import { Injectable } from '@angular/core';

import { UsersServiceRoles } from '@applications/service/shared/interfaces/roles.interface';
import { removeEdgesAcrossResponse } from '@shared/helpers/removeEdges.helper';

import { ServiceGraphResponseInterface } from '../network/service-graph-response.interface';
import { ProjectModel } from '../models/project.model';

@Injectable()
export class DeserializerProjectService {
  parseResolverResponseGraphQL( obj ): ProjectModel {
    const project = new ProjectModel();
    project.pk = obj.pk;
    project.name = obj.name;
    project.typeProject = obj.typeProject;
    project.uuid = obj.uuid || '';
    if (obj.settings) {
      const settings = JSON.parse(obj.settings);
      project.teamCommunicationsModuleEnabled = settings.team_communication || false;
      project.directoryEnabled = settings.directory || false;
    }
    return project;
  }

  parseProjectGraphResponse(dirtyResponse: any): ProjectModel {
    const cleanRes: ServiceGraphResponseInterface = removeEdgesAcrossResponse(dirtyResponse);
    const settings = JSON.parse(cleanRes.settings);
    return new ProjectModel({
      pk: cleanRes.pk,
      name: cleanRes.name,
      steps: cleanRes.steps ? cleanRes.steps.map(i => i.pk) : [],
      teams: cleanRes.myTeams ? cleanRes.myTeams.map(i => i.pk) : [],
      typeProject: cleanRes.typeProject,
      template: cleanRes.template,
      customerName: cleanRes.customer ? cleanRes.customer.name : null,
      nextUrl: cleanRes.nextUrl,
      ticketsModuleEnabled: settings['advisor_request'],
      swarmSessionsModuleEnabled: cleanRes.hasSwarmSession ? cleanRes.hasSwarmSession : false,
      teamCommunicationsModuleEnabled: settings['team_communication'],
      askEcosystemEnabled: settings['ask_to_ecosystem'],
      directoryEnabled: settings['directory'],
      location: cleanRes.location,
      timezone: cleanRes.timezone,
      usersRoles: this.digestParticipantRoles(cleanRes),
      consultantsRoles: this.digestConsultantRoles(cleanRes),
      uuid: cleanRes.uuid
    });
  }

  /**
   * digest consultant roles response
   * @param cleanRes
   */
  private digestConsultantRoles(cleanRes: ServiceGraphResponseInterface): Array<UsersServiceRoles> {
    return cleanRes.consultantsRoles ?
      cleanRes.consultantsRoles.map(consRol  => {
        return {
          userPk: consRol.consultant && consRol.consultant.user ? consRol.consultant.user.pk : undefined,
          roleCode: consRol.exoRole.code,
          roleName: consRol.exoRole.name
        };
      }) : [];
  }

  /**
   * digest participant roles response
   * @param cleanRes
   */
  private digestParticipantRoles(cleanRes: ServiceGraphResponseInterface): Array<UsersServiceRoles> {
    return cleanRes.usersRoles ?
      cleanRes.usersRoles.map(partRol  => {
        return {
          userPk: partRol.user.pk,
          roleCode: partRol.exoRole.code,
        };
      }) : [];
  }
}

