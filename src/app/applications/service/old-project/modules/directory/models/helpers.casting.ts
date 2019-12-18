import { ConsultantModel, UserApplicationModel } from '@applications/shared/models';
import { ConsultantMemberModel } from './consultant-member.model';
import { ParticipantMemberModel } from './participant-member.model';

function doCasting(obj, newObj) {

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

export function buildConsultantMemberModel(obj: ConsultantModel | UserApplicationModel): ConsultantMemberModel {
  const newObj = new ConsultantMemberModel(obj.pk);
  return doCasting(obj, newObj);
}

export function buildParticipantMemberModel(obj: ConsultantModel | UserApplicationModel): ParticipantMemberModel {
  const newObj = new ParticipantMemberModel(obj.pk);
  return doCasting(obj, newObj);
}
