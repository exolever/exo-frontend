import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';

import { Resource } from '@ecosystem-media-library/store/resource.model';

import { OverlayMediaComponent } from '../../overlay-media/components/overlay-media.component';
import { OverlayMediaReference } from '../../overlay-media/overlay-media-ref';
import { VIDEO_DIALOG_DATA } from '../../overlay-media//overlay-media.conf';

interface DialogConfig extends OverlayConfig {
  video?: Resource;
  fromAssignments?: boolean;
}

const DEFAULT_CONFIG: DialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: ['dialog-panel', 'exo-platform'],
  video: null,
  fromAssignments: false
};

@Injectable()
export class OverlayMediaService {

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  open(config: DialogConfig = {}): OverlayMediaReference {
    // Override default configuration

    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost.
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new OverlayMediaReference(overlayRef);

    dialogRef.componentInstance = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

    overlayRef.backdropClick().subscribe(() => dialogRef.close());
    overlayRef.keydownEvents().subscribe((event) => {
      if (event.keyCode === ESCAPE) {
        dialogRef.close();
      }
    });
    return dialogRef;
  }

  private createOverlay(config: DialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: DialogConfig, dialogRef: OverlayMediaReference) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(OverlayMediaComponent, null, injector);
    const containerRef: ComponentRef<OverlayMediaComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: DialogConfig, dialogRef: OverlayMediaReference): PortalInjector {

    const injectionTokens = new WeakMap();

    injectionTokens.set(OverlayMediaReference, dialogRef);
    injectionTokens.set(VIDEO_DIALOG_DATA, {video: config.video, fromAssignments: config.fromAssignments});

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: DialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
  }
}
