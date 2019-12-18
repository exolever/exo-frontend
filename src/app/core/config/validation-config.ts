import { InjectionToken } from '@angular/core';

export interface ValidationConfig {
  maxLength: number;
  maxTextAreaLength: number;
}

export const validationConfig: ValidationConfig = {
  maxLength: 255,
  maxTextAreaLength: 2000,
};

export const VALIDATION_CONFIG = new InjectionToken<ValidationConfig>('validation.config');
export const ValidationConfigProvider = { provide: VALIDATION_CONFIG, useValue: validationConfig };
