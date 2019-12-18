import { InjectionToken } from '@angular/core';
import { getValueEnum } from '@shared/helpers/enum.helper';
import { ConsultantStatusEnum } from '@applications/shared/enums/consultant-status.enum';

import { OrderEnum } from '@applications/shared/enums/order.enum';


export interface DirectoryConfig {
  initialPage: number;
  pageSize: number;
  sortBy: string;
  defaultOrder: {};
  order: OrderEnum;
  defaultFilters: {[key: string]: string[]};
}

export const DirectoryDefaultOrder: {} = {
  'activity': OrderEnum.Desc,
  'projects': OrderEnum.Desc,
  'registered': OrderEnum.Desc,
  'name': OrderEnum.Asc,
  'location': OrderEnum.Asc
};

export const directoryConfig: DirectoryConfig = {
  initialPage: 1,
  pageSize: 12,
  sortBy: 'activity',
  defaultOrder: DirectoryDefaultOrder,
  order: undefined,
  defaultFilters: {'status_staff': [getValueEnum(ConsultantStatusEnum, ConsultantStatusEnum.A)]}
};

export let DIRECTORY_CONFIG = new InjectionToken<DirectoryConfig>('directory.config');

