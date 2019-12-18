import { Directive, Input } from '@angular/core';
import {
  LayoutAlignDirective,
  LayoutDirective,
  FlexAlignDirective,
  FlexDirective,
  FlexFillDirective,
  ShowHideDirective,
  LayoutGapDirective,
  BREAKPOINT
} from '@angular/flex-layout';

const CUSTOM_BREAKPOINTS = [
  {
    alias: 'xxs',
    mediaQuery: 'screen and (min-width: 0px) and (max-width: 479px)',
    overlapping: false
  },
  {
    alias: 'xs',
    mediaQuery: 'screen and (min-width: 480px) and (max-width: 599px)',
    overlapping: false
  },
  {
    alias: 'lt-xs',
    mediaQuery: 'screen and (max-width: 479px)',
    overlapping: true
  },
  {
    alias: 'gt-xxs',
    mediaQuery: 'screen and (min-width: 480px)',
    overlapping: true
  }
];

export const CustomBreakPointsProvider = {
  provide: BREAKPOINT,
  useValue: CUSTOM_BREAKPOINTS,
  multi: true
};

@Directive({
  selector: '[fxLayoutAlign.xxs]',
})
export class CustomLayoutAlignDirective extends LayoutAlignDirective {
  @Input('fxLayoutAlign.xxs') 'fxLayoutAlign.xxs';
}

@Directive({
  selector: '[fxLayout.xxs]',
})
export class CustomLayoutDirective extends LayoutDirective {
  @Input('fxLayout.xxs') 'fxLayout.xxs';
}

@Directive({
  selector: '[fxFlex.xxs]',
})
export class CustomFlexDirective extends FlexDirective {
  @Input('[fxFlex.xxs]') '[fxFlex.xxs]';
}

@Directive({
  selector: '[fxFlexAlign.xxs]',
})
export class CustomFlexAlignDirective extends FlexAlignDirective {
  @Input('[fxFlexAlign.xxs]') '[fxFlexAlign.xxs]';
}

@Directive({
  selector: '[fxFlexFill.xxs]',
})
export class CustomFlexFillDirective extends FlexFillDirective {
  @Input('[fxFlexFill.xxs]') '[fxFlexFill.xxs]';
}

@Directive({
  selector: '[fxHide.xxs], [fxHide.gt-xxs]',
})
export class CustomShowHideDirective extends ShowHideDirective {
  @Input('[fxHide.xxs]') '[fxHide.xxs]';
  @Input('[fxHide.gt-xxs]') '[fxHide.gt-xxs]';
}

@Directive({
  selector: 'fxLayoutGap.xxs',
})
export class CustomLayoutGapDirective extends LayoutGapDirective {
  @Input('fxLayoutGap.xxs') 'fxLayoutGap.xxs';
}
