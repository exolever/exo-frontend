import { ConsultantModel } from './consultant.model';
import { UserApplicationModel } from './user-application.model';

function doCasting(obj, newObj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

export function buildConsultantModel(obj: ConsultantModel | UserApplicationModel): ConsultantModel {
  const newObj = new ConsultantModel(obj.pk);
  return doCasting(obj, newObj);
}
