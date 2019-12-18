import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { WindowScroller } from '@core/fragment-polyfill/fragment-polyfill-interface-config';

@Directive({
  selector: 'a[name]'
})
export class FragmentTargetDirective implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() name: string;
  private fragmentSubscription: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private windowScroller: WindowScroller,
    readonly elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.fragmentSubscription.push(
      this.activatedRoute.fragment.subscribe((fragment: string) => {
        setTimeout(() => {
          if (fragment && (fragment === this.id || fragment === this.name)) {
            this.windowScroller.scrollIntoView( this.elementRef );
          }
        }, 222);
      })
    );
  }

  ngOnDestroy() {
    this.fragmentSubscription.forEach( s => s.unsubscribe() );
  }

}
