import * as MomentTZ from 'moment-timezone';

import { UserApplicationModel } from '@applications/shared/models/user-application.model';

/**
  Some actions could be done automatically by the system, so in this case there
  is no a UserApplicantModel object and just a 'name' about how we call the
  system user. For now this user is called 'OpenExO'
**/
export class UserActionModel {

  constructor(
    public created: MomentTZ.Moment,
    public name: string,
    public user?: UserApplicationModel) {}

  public getUserName(): string {
    return this.user ? this.user.shortName : this.name;
  }

  public getDateTime(): MomentTZ.Moment {
    return this.created;
  }
}
