import { InjectionToken } from '@angular/core';

export interface ProfileViewConfig {
  routeToLanguages: string;
  layoutMaxWidth: string;
  layoutMiddleWidth: string;
}

export const profileViewConfig: ProfileViewConfig = {
  routeToLanguages: 'assets/i18n/iso639-3-languages.json',
  layoutMaxWidth: '1280px',
  layoutMiddleWidth: '960px'
};

export let PROFILE_VIEW_CONFIG = new InjectionToken<ProfileViewConfig>('profile-view.config');

export const ProfileViewConfigProvider = { provide: PROFILE_VIEW_CONFIG, useValue: profileViewConfig };
