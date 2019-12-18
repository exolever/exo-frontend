import { UserModel } from '@app/core';
import * as MomentTZ from 'moment-timezone';


export class SwarmSession {
  pk: number;
  name: string;
  advisors?: UserModel[];
  teamMembers?: UserModel[];
  startAt: MomentTZ.Moment;
  endAt: MomentTZ.Moment;

  constructor(obj) {
    Object.assign(this, obj);
    this.startAt = obj.startAt ? MomentTZ(obj.startAt) : undefined;
    this.endAt = obj.endAt ? MomentTZ(obj.endAt) : undefined;
    this.advisors = obj.advisors ? obj.advisors : [];
  }
}
