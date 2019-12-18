import { Component, Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, take, switchMap, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { OverlayService } from '@overlay/services/overlay.service';

const breakPoints = {
  xxs: '479px',
  xs: '599px',
  sm: '959px',
  md: '1279px',
  lg: '1919px',
};

export const mediaQueries = {
  xxs: `screen and (max-width: ${ breakPoints.xxs })`,
  xs: `screen and (min-width: ${ breakPoints.xxs + 1 }) and (max-width: ${ breakPoints.xs })`,
  sm: `screen and (min-width: ${ breakPoints.xs + 1 }) and (max-width: ${ breakPoints.sm })`,
  md: `screen and (min-width: ${ breakPoints.sm + 1 }) and (max-width: ${ breakPoints.md })`,
  lg: `screen and (min-width: ${ breakPoints.md + 1 }) and (max-width: ${ breakPoints.lg })`,
  xl: `screen and (min-width: ${ breakPoints.lg + 1 })`,
  'lt-xs': `screen and (max-width: ${ breakPoints.xxs })`,
  'lt-sm': `screen and (max-width: ${ breakPoints.xs })`,
  'lt-md': `screen and (max-width: ${ breakPoints.sm })`,
  'lt-lg': `screen and (max-width: ${ breakPoints.md })`,
  'lt-xl': `screen and (max-width: ${ breakPoints.lg })`,
  'gt-xxs': `screen and (min-width: ${ breakPoints.xxs })`,
  'gt-xs': `screen and (min-width: ${ breakPoints.xs })`,
  'gt-sm': `screen and (min-width: ${ breakPoints.sm })`,
  'gt-md': `screen and (min-width: ${ breakPoints.md })`,
  'gt-lg': `screen and (min-width: ${ breakPoints.lg })`,
};

@Injectable()
export class BreakPointService {
  dialogRef: MatDialogRef<any>;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private matDialog: MatDialog,
    private overlayService: OverlayService,
  ) { }

  observe(media): Observable<boolean> {
    return this.breakpointObserver.observe(media)
      .pipe(
        take(1),
        map(res => res.matches),
      );
  }

  /**
   * Open dialog in Full screen if the devices resolution is less than md and Dialog if is greater than md.
   * @param component | Component to open dialog
   * @param data | Data to inject in the dialog
   */

  fsSmDialogLg(component: any, data: any) {
    return this.observe(mediaQueries['lt-md']).pipe(
      tap( ltMd => {
        if (ltMd) {
          const config = { ...data, showFullScreen: true };
          this.overlayService.open(<Component>component, {
            data: config
          });
        } else {
          const config = { ...data, showFullScreen: false };
          this.dialogRef = this.matDialog.open(component, {
            data: config
          });
        }
    }));
  }

  fsSmDialogLgClosed(): Observable<any> {
    return this.observe(mediaQueries['lt-md']).pipe(
      switchMap((ltMd) => ltMd ? this.overlayService.dialogRef.afterClosed() : this.dialogRef.afterClosed()
      ),
    );
  }

}
