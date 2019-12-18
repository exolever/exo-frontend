import { Injectable } from '@angular/core';

import { removeEdgesAcrossResponse } from '@shared/helpers/removeEdges.helper';
import { DeserializerUserService, DeserializerConsultantService } from '@applications/shared/services';

import {
  ConsultantMemberModel,
  ParticipantMemberModel,
  buildConsultantMemberModel,
  buildParticipantMemberModel
} from '../models';


@Injectable()
export class DeserializeTeamService {

  constructor ( private deserializerUser: DeserializerUserService,
                private deserializerConsultant: DeserializerConsultantService ) {}

  parseData( data: Object ): Array<ConsultantMemberModel | ParticipantMemberModel> {
    const cleanData: any = removeEdgesAcrossResponse(data);
    let members: Array<ConsultantMemberModel | ParticipantMemberModel> = [];
    // To get consultant Roles and user roles
    const consultantsRoles = cleanData.consultantsRoles;
    const userRoles = cleanData.usersRoles;
    // To parse consultants assigned to project
    const consultants = this.deserializeConsultantsRoles( cleanData, consultantsRoles );
    // To parse user assigned to project
    const participants = this.deserializeUsersRoles( cleanData, userRoles );

    members = members.concat( consultants );
    members = members.concat( participants );
    // To mark each member with the correct team
    this.parseTeamMember( cleanData, consultants, participants );
    return members;
  }

  parseRolesUsedByConsultant( data ): Array<{name: string, code: string}> {
    data = removeEdgesAcrossResponse(data);
    return this.getListRoles(data.consultantsRoles);
  }

  parseRolesUsedByUser( data ): Array<{name: string, code: string}> {
    data = removeEdgesAcrossResponse(data);
    return this.getListRoles(data.usersRoles);
  }

  getListRoles( roles: Array<any> ): Array<{name: string, code: string}> {
    return roles.map(cR => ({code: cR.exoRole.code, name: cR.exoRole.name}));
  }

  deserializeConsultantsRoles( data, consultantRolesList ): Array<ConsultantMemberModel> {
    return consultantRolesList.map( consultant => {
      return this.createConsultant( data, consultant );
    });
  }

  deserializeUsersRoles( data, userRolesList ): Array<ParticipantMemberModel> {
    return userRolesList
      .map( member => this.createParticipant( data, member ) );
  }

  createParticipant( data, memberNode ): ParticipantMemberModel {
    const user = this.deserializerUser.user(memberNode.user);
    const newMember = buildParticipantMemberModel(user);
    newMember.setRoleRelation( memberNode.exoRole.code, memberNode.exoRole.name, memberNode.status );

    return newMember;
  }

  createConsultant( data, consultantNode ): ConsultantMemberModel {
    const user = this.deserializerUser.user(consultantNode.consultant.user);
    const newMember = buildConsultantMemberModel(user);
    newMember.setPkConsultant(consultantNode.consultant.pk);
    newMember.setRoleRelation(consultantNode.exoRole.code, consultantNode.exoRole.name, consultantNode.status);
    this.deserializeExtraInformationForConsultant(newMember, consultantNode.consultant);
    return newMember;
  }

  deserializeExtraInformationForConsultant(instanceMember: ConsultantMemberModel, obj): ConsultantMemberModel {
    instanceMember.setSocialNetworks(
      this.deserializerUser.parseSocialNetworks(obj.socialNetworks ? obj.socialNetworks : []));
    instanceMember.setIndustries(
      this.deserializerConsultant.parseIndustries(obj.industries ? obj.industries : []));
    instanceMember.setLanguages(this.deserializerConsultant.parseLanguages(obj.languages ? obj.languages : []));

    return instanceMember;
  }

  parseTeamMember (
    data,
    consultants: Array<ConsultantMemberModel>,
    participants: Array<ParticipantMemberModel>
  ): void {
    data.teams.forEach ( team => {
      this.addTeamsToParticipants( team, participants );
      this.addTeamsToCoaches( team, consultants );
    });
  }

  addTeamsToParticipants( team: any, participants: Array<ParticipantMemberModel> ): void {
    team.teamMembers.forEach(teamMember => {
      const member = participants.find( part => part.pk === teamMember.pk );
      if ( member ) { member.addTeam( team.pk ); }
    });
  }

  addTeamsToCoaches( team: any, consultants: Array<ConsultantMemberModel> ): void {
    const coachMember = consultants.find(obj => obj.pkConsultant === team.coach.pk);
    if ( coachMember ) { coachMember.addTeam( team.pk ); }
  }
}
