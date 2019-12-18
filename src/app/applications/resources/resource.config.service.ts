import { InjectionToken } from '@angular/core';
import { IResourceConfig } from './resources-config';

export const globalResourceConfig: IResourceConfig = {
  maxFileSize: 52428800, // 50 MB
  timeSnackBar: 100000,
  policyAddResources: 10000
};

export let RESOURCES_CONFIG = new InjectionToken('resource.app.config');
