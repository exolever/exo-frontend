import { NgModule, ModuleWithProviders } from '@angular/core';

import { FragmentTargetDirective } from './directives/fragment-target.directive';
import { WINDOW_SCROLLER_OPTIONS, WindowScroller } from './fragment-polyfill-interface-config';
import { NativeWindowScroller } from './classes/window-scroller';

interface ModuleOptions {
  smooth?: boolean;
}

@NgModule({
  exports: [FragmentTargetDirective],
  declarations: [FragmentTargetDirective]
})
export class FragmentPolyfillModule {
  static forRoot( options?: ModuleOptions ): ModuleWithProviders {

    return({
      ngModule: FragmentPolyfillModule,
      providers: [
        {
          provide: WINDOW_SCROLLER_OPTIONS,
          useValue: {
            smooth: ( ( options && options.smooth ) || false )
          }
        },
        { provide: WindowScroller, useClass: NativeWindowScroller }
      ]
    });
  }

}
