import { Overlay } from '@angular/cdk/overlay';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Injector } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBarConfig, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { uiConfig } from '@core/config/ui-config';

class CustomSnackBar extends MatSnackBar {
  private config = new MatSnackBarConfig();

  constructor(
    _overlay: Overlay,
    _live: LiveAnnouncer,
    _injector: Injector,
    _breakpointObserver: BreakpointObserver,
    _parentSnackBar: MatSnackBar,
    _defaultConfig: MatSnackBarConfig
  ) {
    super(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig);
    this.config.duration = uiConfig.durationMatSnackBar;
  }

  open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    Object.assign(this.config, config);
    return super.open(message, action, this.config);
  }
}

export function SnackBarFactory(
  _overlay: Overlay,
  _live: LiveAnnouncer,
  _injector: Injector,
  _breakpointObserver: BreakpointObserver,
  _parentSnackBar: MatSnackBar,
  _defaultConfig: MatSnackBarConfig) {
  return new CustomSnackBar(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig);
}
