import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewContainerRef,
  Inject,
  InjectionToken
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  OverlayRef,
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  VerticalConnectionPos,
  RepositionScrollStrategy,
  ScrollStrategy,
  OverlayConfig
} from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';

import { PopoverPositionX, PopoverPositionY } from './popover-positions';
import { MatPopoverPanel } from './popover-panel';
import { throwMatPopoverMissingError } from './popover-errors';


/** Injection token that determines the scroll handling while the popover is open. */
export const MAT_POPOVER_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('mat-popover-scroll-strategy');

/** @docs-private */
export function MAT_POPOVER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay):
  () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const MAT_POPOVER_SCROLL_STRATEGY_PROVIDER = {
  provide: MAT_POPOVER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MAT_POPOVER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};


/**
 * This directive is intended to be used in conjunction with an mat-popover tag.  It is
 * responsible for toggling the display of the provided popover instance.
 */
@Directive({
  selector: `[mat-popover-trigger-for], [matPopoverTriggerFor]`,
  exportAs: 'matPopoverTrigger'
})
export class MatPopoverTriggerDirective implements AfterViewInit, OnDestroy {
  private _portal: TemplatePortal<any>;
  private _overlayRef: OverlayRef | null = null;
  private _popoverOpen = false;
  private _backdropSubscription: Subscription;
  private _positionSubscription: Subscription;

  // tracking input type is necessary so it's possible to only auto-focus
  // the first item of the list when the popover is opened via the keyboard
  private _openedByMouse = false;

  private _durationTimeoutId: number;


  @Input('mat-popover-trigger-for')
  get _deprecatedMatPopoverTriggerFor(): MatPopoverPanel { return this.popover; }
  set _deprecatedMatPopoverTriggerFor(v: MatPopoverPanel) { this.popover = v; }

  // Trigger input for compatibility mode
  @Input('matPopoverTriggerFor')
  get _matPopoverTriggerFor(): MatPopoverPanel { return this.popover; }
  set _matPopoverTriggerFor(v: MatPopoverPanel) { this.popover = v; }

  /** References the popover instance that the trigger is associated with. */
    // tslint:disable-next-line:no-input-rename
  @Input('matPopoverTriggerFor') popover: MatPopoverPanel;

  /** Event emitted when the associated popover is opened. */
  @Output() onPopoverOpen = new EventEmitter<void>();

  /** Event emitted when the associated popover is closed. */
  @Output() onPopoverClose = new EventEmitter<void>();


  @HostListener('click') onClick() {
    if (this.popover.matPopoverTrigger === 'click') {
      this.togglePopover();
    }
  }

  @HostListener('mouseover') onMouseOver() {
    if (this.popover.matPopoverTrigger === 'hover') {
      this._durationTimeoutId = window.setTimeout(() => {
        this.openPopover();
      }, this.popover.matPopoverDelay);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.popover.matPopoverTrigger === 'hover') {
      clearTimeout(this._durationTimeoutId);
      if (this._popoverOpen) {
        this._durationTimeoutId = window.setTimeout(() => {
          if (!this.popover.closeDisabled) {
            this.closePopover();
          }
        }, 200);
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent): void {
    if (!isFakeMousedownFromScreenReader($event)) {
      this._openedByMouse = true;
    }
  }

  constructor(private _overlay: Overlay,
              private _element: ElementRef,
              private _viewContainerRef: ViewContainerRef,
              @Inject(MAT_POPOVER_SCROLL_STRATEGY) private _scrollStrategy,
              @Optional() private _dir: Directionality) {}

  ngAfterViewInit() {
    this._checkPopover();
    this.popover.close.subscribe(() => this.closePopover());
  }

  ngOnDestroy() { this.destroyPopover(); }

  /** Whether the popover is open. */
  get popoverOpen(): boolean { return this._popoverOpen; }

  /** Toggles the popover between the open and closed states. */
  togglePopover(): void {
    return this._popoverOpen ? this.closePopover() : this.openPopover();
  }


  /** Opens the popover. */
  openPopover(): void {
    if (!this._popoverOpen) {
      this._createOverlay().attach(this._portal);
      this._subscribeToBackdrop();
      this._initPopover();
    }
  }

  /** Closes the popover. */
  closePopover(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._backdropSubscription.unsubscribe();
      this._resetPopover();
    }
  }

  /** Removes the popover from the DOM. */
  destroyPopover(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
      this._cleanUpSubscriptions();
    }
  }

  /** Focuses the popover trigger. */
  focus() {
    this._element.nativeElement.focus();
  }

  /** The text direction of the containing app. */
  get dir(): Direction {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }

  /**
   * This method ensures that the popover closes when the overlay backdrop is clicked.
   * We do not use first() here because doing so would not catch clicks from within
   * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
   * explicitly when the popover is closed or destroyed.
   */
  private _subscribeToBackdrop(): void {
    if (this._overlayRef) {
      this._backdropSubscription = this._overlayRef.backdropClick().subscribe(() => {
        this.popover._emitCloseEvent();
      });
    }
  }

  /**
   * This method sets the popover state to open and focuses the first item if
   * the popover was opened via the keyboard.
   */
  private _initPopover(): void {
    this._setIsPopoverOpen(true);

    // Should only set focus if opened via the keyboard, so keyboard users can
    // can easily navigate popover items. According to spec, mouse users should not
    // see the focus style.
    if (!this._openedByMouse) {
      this.popover.focusFirstItem();
    }
  }

  /**
   * This method resets the popover when it's closed, most importantly restoring
   * focus to the popover trigger if the popover was opened via the keyboard.
   */
  private _resetPopover(): void {
    this._setIsPopoverOpen(false);

    // Focus only needs to be reset to the host element if the popover was opened
    // by the keyboard and manually shifted to the first popover item.
    if (!this._openedByMouse) {
      this.focus();
    }
    this._openedByMouse = false;
  }

  // set state rather than toggle to support triggers sharing a popover
  private _setIsPopoverOpen(isOpen: boolean): void {
    this._popoverOpen = isOpen;
    this._popoverOpen ? this.onPopoverOpen.emit() : this.onPopoverClose.emit();
  }

  /**
   *  This method checks that a valid instance of MatPopover has been passed into
   *  matPopoverTriggerFor. If not, an exception is thrown.
   */
  private _checkPopover() {
    if (!this.popover) {
      throwMatPopoverMissingError();
    }
  }

  /**
   *  This method creates the overlay from the provided popover's template and saves its
   *  OverlayRef so that it can be attached to the DOM when openPopover is called.
   */
  private _createOverlay(): OverlayRef {
    if (!this._overlayRef) {
      this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
      const config = this._getOverlayConfig();
      this._subscribeToPositions(config.positionStrategy as FlexibleConnectedPositionStrategy);
      this._overlayRef = this._overlay.create(config);
    }
    return this._overlayRef;
  }

  /**
   * This method builds the configuration object needed to create the overlay, the OverlayConfig.
   * @returns OverlayConfig
   */
  private _getOverlayConfig(): OverlayConfig {
    const overlayState = new OverlayConfig();
    overlayState.positionStrategy = this.getPositions();
    if (this.popover.matPopoverTrigger === 'click') {
      overlayState.hasBackdrop = true;
      overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
    }
    overlayState.direction = this.dir;
    overlayState.scrollStrategy = this._scrollStrategy();
    return overlayState;
  }

  /**
   * Listens to changes in the position of the overlay and sets the correct classes
   * on the popover based on the new position. This ensures the animation origin is always
   * correct, even if a fallback position is used for the overlay.
   */
  private _subscribeToPositions(position: FlexibleConnectedPositionStrategy): void {
    this._positionSubscription = position.positionChanges.subscribe((change) => {
      const posX: PopoverPositionX = change.connectionPair.originX === 'start' ? 'after' : 'before';
      let posY: PopoverPositionY = change.connectionPair.originY === 'top' ? 'below' : 'above';

      if (!this.popover.overlapTrigger) {
        posY = posY === 'below' ? 'above' : 'below';
      }
      this.popover.setPositionClasses(posX, posY);
    });
  }

  /**
   * This method builds the position strategy for the overlay, so the popover is properly connected
   * to the trigger.
   * @returns FlexibleConnectedPositionStrategy
   */
  private getPositions(): FlexibleConnectedPositionStrategy  {
    const [posX, fallbackX]: HorizontalConnectionPos[] =
      this.popover.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];

    const [overlayY, fallbackOverlayY]: VerticalConnectionPos[] =
      this.popover.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

    let originY = overlayY;
    let fallbackOriginY = fallbackOverlayY;

    if (!this.popover.overlapTrigger) {
      originY = overlayY === 'top' ? 'bottom' : 'top';
      fallbackOriginY = fallbackOverlayY === 'top' ? 'bottom' : 'top';
    }

    return this._overlay
      .position()
      .flexibleConnectedTo(this._element)
      .withPositions([
        {originX: posX, originY: originY, overlayX: posX, overlayY: overlayY},
        {originX: fallbackX, originY: originY, overlayX: fallbackX, overlayY: overlayY},
        {originX: posX, originY: fallbackOriginY, overlayX: posX, overlayY: fallbackOverlayY},
        {originX: fallbackX, originY: fallbackOriginY, overlayX: fallbackX, overlayY: fallbackOverlayY}
      ]);
  }

  private _cleanUpSubscriptions(): void {
    if (this._backdropSubscription) {
      this._backdropSubscription.unsubscribe();
    }
    if (this._positionSubscription) {
      this._positionSubscription.unsubscribe();
    }
  }

}
