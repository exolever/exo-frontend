import * as MomentTZ from 'moment-timezone';

import { UserApplicationModel } from '@applications/shared/models/user-application.model';

export class RatingModel {
  public user: UserApplicationModel;
  public created: MomentTZ.Moment;
  public rating: Number;
  public comment: string;
  public category: string;

  constructor(public pk: string) { }
}
