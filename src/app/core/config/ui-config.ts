import { InjectionToken } from '@angular/core';
import { UiConfig } from './ui-config-interface';

export const uiConfig: UiConfig = {
  durationMatSnackBar: 12000, // 12 seg
  layoutMaxWidth: '1280px',
  layoutMiddleWidth: '960px',
  layoutMinWidth: '768px'
};

export const UI_CONFIG = new InjectionToken<UiConfig>('ui.config');

export const UiConfigProvider = { provide: UI_CONFIG, useValue: uiConfig };
