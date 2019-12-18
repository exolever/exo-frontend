import * as MomentTZ from 'moment-timezone';

import { typeProjectEnum } from '@applications/service/shared/enums/project.enum';

/** interface to properly have a data model to access the roles response properties */
export interface ProjectsRoles {
  badge: { status: string };
  project: ProjectsWithinRoles;
  rating: number;
  roles: RoleDescription[];
  status: string;
}

export interface ProjectsWithinRoles {
  pk: string;
  name: string;
  start: MomentTZ.Moment;
  firstDay: MomentTZ.Moment;
  typeProject: typeProjectEnum;
  customer: { name: string };
}

export interface RoleDescription {
  code: string;
  name: string;
}


