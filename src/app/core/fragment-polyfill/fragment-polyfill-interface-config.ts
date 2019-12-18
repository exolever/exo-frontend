import { ElementRef, InjectionToken } from '@angular/core';

export abstract class WindowScroller {
  abstract scrollIntoView( elementRef: ElementRef ): void;
}

export interface WindowScrollerOptions {
  smooth: boolean;
}

export const WINDOW_SCROLLER_OPTIONS = new InjectionToken<WindowScrollerOptions>( 'WindowScroller.Options' );
