import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { WindowRef } from '@app/core';

@Directive({
  selector: '[appStickyOnScroll]'
})
export class StickyOnScrollDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('offsetTopElement') offsetTopElement: HTMLElement;
  @Input('disableOnMobile') disableOnMobile = false;
  @Input('classOnAbsolute') classOnAbsolute = {};
  @Input('classOnFixed') classOnFixed = {};
  private subscriptions: Subscription[] = [];
  disable: boolean;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private w: WindowRef,
  ) {}
  ngOnInit() {
    this.disable = this.w.nativeWindow.screen.width < 599 && this.disableOnMobile;
    if (!this.disable) {
      this.setElementPositionStyle();
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      // subscription to scroll event
      observableFromEvent(this.w.nativeWindow, 'scroll').subscribe(
        (scroll: Event) => {
          if (!this.disable) {
            this.setElementPositionStyle(this.setSidenavTopOffset(scroll));
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe() );
  }

  /**
   * determine the offset top of the containing element minus the scroll top. In case scroll top is higher than offset
   * then return 0
   * @param scrollEv
   */
  setSidenavTopOffset(scrollEv: Event): number {
    const scrollTop = (<any>scrollEv.target).scrollingElement.scrollTop;
    const offsetTop = this.offsetTopElement ? this.offsetTopElement.offsetTop : 0;
    return scrollTop < offsetTop ? offsetTop - scrollTop : 0;
  }

  /**
   * Scroll position
   * @param scrollPos
   */
  setElementPositionStyle(scrollPos: number = 1): void {
    if (scrollPos === 0) {
      this.renderer.setStyle(this.elRef.nativeElement, 'position', 'fixed');
      Object.keys(this.classOnFixed).forEach(key => {
        this.renderer.setStyle(this.elRef.nativeElement, key, this.classOnFixed[key]);
      });
    } else {
      this.renderer.setStyle(this.elRef.nativeElement, 'position', 'absolute');
      Object.keys(this.classOnAbsolute).forEach(key => {
        this.renderer.setStyle(this.elRef.nativeElement, key, this.classOnAbsolute[key]);
      });
    }
  }
}
