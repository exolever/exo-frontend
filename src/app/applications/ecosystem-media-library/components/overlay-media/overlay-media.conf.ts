import { InjectionToken } from '@angular/core';

import { Resource } from '@ecosystem-media-library/store/resource.model';

export const STATE_VOID = 'void';
export const STATE_ENTER = 'enter';
export const STATE_LEAVE = 'leave';
export type STATE_ANIMATION = 'void' | 'enter' | 'leave';

export const ANIMATION_START = 'start';
export const ANIMATION_DONE = 'done';
export const ANIMATION_LEAVE = 'leave';

export const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';
export const VIDEO_DIALOG_DATA = new InjectionToken<Resource>('VIDEO_DIALOG_DATA');
