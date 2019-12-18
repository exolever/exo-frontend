import * as MomentTZ from 'moment-timezone';

import { RoleModel } from '@core/modules/roles/models';
import { RoleCategoryEnum } from '@core/modules/roles/enums';

import { CategoryModel } from './category.model';

enum JobExtraData {
  ZOOM_URL = 'zoomUrl'
}

export enum JobStatus {
  UNSTARTED = 'UP',
  FINISHED = 'CO',
  LIVE = 'LI',
  RUNNING = 'IN',
  UNKNOWN = 'UN'
}

export class Job {
  pk: string;
  category: CategoryModel;
  role: RoleModel;
  title: string;
  start: MomentTZ.Moment;
  end?: MomentTZ.Moment;
  status: JobStatus;
  statusDetail: string;
  url?: string;
  zoomUrl?: string;

  constructor(data: any) {
    Object.assign(this, data);
    this.start = data.start ? MomentTZ(data.start).utc() : undefined;
    this.end = data.end ? MomentTZ(data.end).utc() : undefined;
    this.category = new CategoryModel(data.category);
    this.role = new RoleModel(data.exoRole);
    this.zoomUrl = data.extraData ? data.extraData[JobExtraData.ZOOM_URL] : undefined;
  }

  isProject(): boolean {
    return RoleCategoryEnum.enums.SPRINT === this.category.code;
  }

  isSwarm(): boolean {
    return RoleCategoryEnum.enums.SWARM === this.category.code;
  }

  isFastrack(): boolean {
    return RoleCategoryEnum.enums.FASTRACK === this.category.code;
  }

  isUnstartedSwarm(): boolean {
    return (this.isSwarm() && this.isUnstarted());
  }

  isToday(): boolean {
    return this.start && this.start.isSame(new Date(), 'day');
  }

  isTomorrow(): boolean {
    const MILISECONDS_IN_A_DAY = (24 * 60 * 60 * 1000);
    return this.start && this.start.isSame(new Date().getTime() + MILISECONDS_IN_A_DAY, 'day');
  }

  canShowTime(): boolean {
    return this.start &&
      (this.category.code === RoleCategoryEnum.enums.SWARM
        || this.category.code === RoleCategoryEnum.enums.ADVISOR_CALL);
  }

  isFinished(): boolean {
    return this.status === JobStatus.FINISHED;
  }

  isLive(): boolean {
    return this.status === JobStatus.LIVE;
  }

  isRunning(): boolean {
    return this.status === JobStatus.RUNNING;
  }

  isUnstarted(): boolean {
    return this.status === JobStatus.UNSTARTED;
  }
}
