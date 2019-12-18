import { ElementRef, Inject } from '@angular/core';
import { WINDOW_SCROLLER_OPTIONS, WindowScroller, WindowScrollerOptions } from '../fragment-polyfill-interface-config';

export class NativeWindowScroller implements WindowScroller {

  readonly behavior: 'auto' | 'smooth';
  private timer: any;

  // initialize the window scroller implementation.
  public constructor( @Inject( WINDOW_SCROLLER_OPTIONS ) options: WindowScrollerOptions ) {

    this.behavior = ( options.smooth ? 'smooth' : 'auto' );
    this.timer = null;

  }

  /**
   * I scroll the given ElementRef into the client's viewport.
   */
  scrollIntoView( elementRef: ElementRef ): void {

    // NOTE: There is an odd race-condition that I cannot figure out. The initial
    // scrollToView() will not work when the BROWSER IS REFRESHED. It will work if
    // the page is opened in a new tab; it only fails on refresh (WAT?!). To fix this
    // peculiarity, I'm putting the first scroll operation behind a timer. The rest
    // of the scroll operations will initiate synchronously.
    if ( this.timer ) {
      this.doScroll( elementRef );
    } else {
      this.timer = setTimeout((): void => { this.doScroll( elementRef ); }, 0 );
    }

  }

  /**
   * perform the scrolling of the viewport.
   * @param {ElementRef} elementRef
   */
  private doScroll( elementRef: ElementRef ): void {
    elementRef.nativeElement.scrollIntoView({
      behavior: this.behavior,
      block: 'start'
    });
  }

}
