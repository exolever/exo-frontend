import { InjectionToken } from '@angular/core';

import { OrderEnum } from '@applications/shared/enums/';

export interface MediaLibraryConfig {
  initialPage: number;
  pageSize: number;
  order: OrderEnum;
  sortBy: string;
  defaultOrder: {};
  layoutMaxWidth: string;
}

export const MediaLibraryDefaultOrder: {} = {
  'name': OrderEnum.Desc,
  'created': OrderEnum.Asc
};

export const mediaLibraryConfig: MediaLibraryConfig = {
  initialPage: 1,
  pageSize: 12,
  order: undefined,
  sortBy: 'name',
  defaultOrder: MediaLibraryDefaultOrder,
  layoutMaxWidth: '1280px'
};

export enum ResourceActions {
  DELETE,
  CHANGE_VISIBILITY
}

export interface IResourceActions {
  action: ResourceActions;
  text: string;
  thumbnail?: string;
}

export let LIBRARY_CONFIG = new InjectionToken<MediaLibraryConfig>('media-library.config');

export const MediaLibraryConfigProvider = { provide: LIBRARY_CONFIG, useValue: mediaLibraryConfig };
