import { InjectionToken } from '@angular/core';

export interface PublicAreaConfig {
  layoutMaxWidth: string;
}

export const publicAreaConfig: PublicAreaConfig = {
  layoutMaxWidth: '400px'
};

export let PUBLIC_AREA_CONFIG = new InjectionToken<PublicAreaConfig>('public-area.config');

export const PublicAreaConfigProvider = { provide: PUBLIC_AREA_CONFIG, useValue: publicAreaConfig };
