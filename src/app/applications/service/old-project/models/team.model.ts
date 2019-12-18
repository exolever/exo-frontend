import { PermissionMixin } from '@core/models/permission.model';

import { Stream } from '@applications/service/shared/enums/stream.enum';

export interface ITeamModel {
  pk: string;
  name?: string;
  stream?: Stream;
  streamDisplay?: string;
  zoomUrl?: string;
  permissions?: string[];
  groupUuid?: string;
}

export class TeamModel extends PermissionMixin {
  pk: string;
  name?: string;
  stream?: Stream;
  streamDisplay?: string;
  zoomUrl?: string;
  // Manage advisory calls
  groupUuid?: string;

  constructor (data: ITeamModel) {
    super();
    Object.assign(this, data);
  }

  setPermissions( permissions: Array<string> ): void {
    this.permissions = permissions;
  }

}
