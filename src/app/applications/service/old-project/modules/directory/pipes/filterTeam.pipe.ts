import { Pipe, PipeTransform } from '@angular/core';

import { IMemberModel } from '../models/member.model';
import { CONSULTANT_MEMBER_TYPE, USER_MEMBER_TYPE } from '../interfaces/filterTeam.interface';

@Pipe({
  name: 'membersByRole'
})
export class MembersByRole implements PipeTransform {
  transform(value: Array<any>, filterBy?: any, filterByData?: any, availableFilters?: any) {
    if (filterBy && availableFilters.indexOf(filterBy) > -1) {
      const memberType = filterByData.memberType;
      return value.filter((m: IMemberModel) => {
        // Filter by Role if the user has multiple roles in the project.
        if (Array.isArray(m.roleCode)) {
          return (
            memberType === CONSULTANT_MEMBER_TYPE &&
            m.isConsultant() &&
            m.roleCode.find(code => code === filterBy)
            ) ||
            (
              memberType === USER_MEMBER_TYPE &&
              m.isParticipant() &&
              m.roleCode.find(code => code === filterBy)
            );
        }
        return (memberType === CONSULTANT_MEMBER_TYPE && m.isConsultant() && m.roleCode === filterBy) ||
            (memberType === USER_MEMBER_TYPE && m.isParticipant() && m.roleCode === filterBy);
      });
    } else {
      return value;
    }
  }
}

@Pipe({
  name: 'membersByTeam'
})
export class MembersByTeam implements PipeTransform {
  transform(value: Array<any>, filterBy?: any) {
    if (filterBy && +filterBy > 0) {
      return value.filter((m: IMemberModel) => (m.teams.indexOf(filterBy) >= 0));
    } else {
      return value;
    }
  }
}
