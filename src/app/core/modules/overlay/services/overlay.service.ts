import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Component, ComponentRef, Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { Observable } from 'rxjs';

import { OverlayReference } from '@overlay/overlay-ref';

interface Config extends OverlayConfig {
  data?: any;
}

const DEFAULT_OVERLAY_CONFIG: Config = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: ['full-screen-panel', 'exo-platform'],
  width: '100%',
  height: '100%',
  data: {
    title: ''
  }
};

export const DATA = new InjectionToken('DATA');

/* Can't be Singleton. The reason is that need every injector from module where is imported
to know his entryComponents. */
@Injectable()
export class OverlayService {
  private className = 'fullscreen-dialog-opened';
  private afterClosed$: Observable<void>;
  dialogRef: OverlayReference;

  constructor(
    private injector: Injector,
    private overlay: Overlay,
    @Inject(DOCUMENT) private doc?: any
  ) { }

  open(dynamicComponent: Component, config: Config = {}) {
    /* Add class in order to avoid scrolling in the full screen dialog better than scrollStrategy
    from OverlayConfig because they block but show the scrollbar.
    */
    this.doc.body.classList.add(this.className);
    const overlayConfig = { ...DEFAULT_OVERLAY_CONFIG, ...config };

    const overlayRef = this.createOverlay(overlayConfig);
    this.dialogRef = new OverlayReference(overlayRef, dynamicComponent);
    this.removeClassName(this.dialogRef);

    this.afterClosed$ = this.dialogRef.afterClosed();
    this.dialogRef.componentInstance = this.attachDialogContainer(
      overlayRef, overlayConfig, this.dialogRef, dynamicComponent);
  }

  /**
   * The components will be subscribe to this variable to know when the overlay is closed and get the response/data
   * from the overlay component.
   * @returns {any}
   */
  get afterClosed(): any {
    return this.afterClosed$;
  }

  /**
   * To remove the scroll block when the overlay is closed.
   * @param dialogRef
   */
  private removeClassName(dialogRef) {
    dialogRef.afterClosed().subscribe(() => {
      this.doc.body.classList.remove(this.className);
    });
  }

  private createOverlay(config: Config) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: Config, dialogRef: OverlayReference, component: any) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(component, null, injector);
    const containerRef: ComponentRef<any> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  /**
   * Set DATA and Reference for the new ComponentPortal.
   * @param {Config} config
   * @param {OverlayReference} dialogRef
   * @returns {PortalInjector}
   */
  private createInjector(config: Config, dialogRef: OverlayReference): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayReference, dialogRef);
    injectionTokens.set(DATA, config.data);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: Config): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      panelClass: config.panelClass,
      positionStrategy
    });
  }

  close() {
    this.dialogRef.close();
  }
}
