import {
  AfterContentInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  InjectionToken,
  Inject
} from '@angular/core';
import { PopoverPositionX, PopoverPositionY } from './popover-positions';
import { throwMatPopoverInvalidPositionX, throwMatPopoverInvalidPositionY } from './popover-errors';
import { MatPopoverPanel } from './popover-panel';
import { transformPopover, fadeInItems } from './popover-animations';


/** Default `mat-popover` options that can be overridden. */
export interface MatPopoverDefaultOptions {
  xPosition: PopoverPositionX;
  yPosition: PopoverPositionY;
  overlapTrigger: boolean;
}

/** Injection token to be used to override the default options for `mat-popover`. */
export const MAT_POPOVER_DEFAULT_OPTIONS =
  new InjectionToken<MatPopoverDefaultOptions>('mat-popover-default-options');


@Component({
  selector: 'mat-popover',
  templateUrl: 'popover.html',
  styleUrls: ['popover.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    transformPopover,
    fadeInItems
  ],
  exportAs: 'matPopover'
})
export class MatPopoverComponent implements AfterContentInit, MatPopoverPanel, OnDestroy {
  private _xPosition: PopoverPositionX = this._defaultOptions.xPosition;
  private _yPosition: PopoverPositionY = this._defaultOptions.yPosition;
  /** Event emitted when the popover is closed. */
  @Output() close = new EventEmitter<void>();

  /** Config object to be passed into the popover's ngClass */
  _classList: any = {};

  /** Position of the menu in the X axis. */
  @Input()
  get xPosition() { return this._xPosition; }
  set xPosition(value) {
    if (value !== 'before' && value !== 'after') {
      throwMatPopoverInvalidPositionX();
    }
    this._xPosition = value;
    this.setPositionClasses();
  }

  /** Position of the menu in the Y axis. */
  @Input()
  get yPosition() { return this._yPosition; }
  set yPosition(value) {
    if (value !== 'above' && value !== 'below') {
      throwMatPopoverInvalidPositionY();
    }
    this._yPosition = value;
    this.setPositionClasses();
  }

  @ViewChild(TemplateRef, {static: false}) templateRef: TemplateRef<any>;

  /** Whether the popover should overlap its trigger. */
  @Input() overlapTrigger = true;

  /** Popover Trigger event */
  @Input() matPopoverTrigger = 'hover';

  /** Popover placement */
  @Input() matPopoverPlacement = 'bottom';

  /** Popover delay */
  @Input() matPopoverDelay = 300;

  closeDisabled = false;

  @HostListener('mouseover') onMouseOver() {
    if (this.matPopoverTrigger === 'hover') {
      this.closeDisabled = true;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.matPopoverTrigger === 'hover') {
      this.closeDisabled = false;
      this.close.emit();
    }
  }

  /**
   * This method takes classes set on the host mat-popover element and applies them on the
   * popover template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing popover from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set classList(classes: string) {
    this._classList = classes.split(' ').reduce((obj: any, className: string) => {
      obj[className] = true;
      return obj;
    }, {});
    this.setPositionClasses(this.xPosition, this.yPosition);
  }

  constructor(
    @Inject(MAT_POPOVER_DEFAULT_OPTIONS) private _defaultOptions: MatPopoverDefaultOptions) { }

  ngAfterContentInit() {}

  ngOnDestroy() {
    this._emitCloseEvent();
    this.close.complete();
  }


  /**
   * Focus the first item in the popover. This method is used by the popover trigger
   * to focus the first item when the popover is opened by the ENTER key.
   */
  focusFirstItem() {}

  /**
   * This emits a close event to which the trigger is subscribed. When emitted, the
   * trigger will close the popover.
   */
  _emitCloseEvent(): void {
    this.close.emit();
  }

  /**
   * It's necessary to set position-based classes to ensure the popover panel animation
   * folds out from the correct direction.
   */
  setPositionClasses(posX = this.xPosition, posY = this.yPosition): void {
    this._classList['mat-popover-before'] = posX === 'before';
    this._classList['mat-popover-after'] = posX === 'after';
    this._classList['mat-popover-above'] = posY === 'above';
    this._classList['mat-popover-below'] = posY === 'below';
  }

}
