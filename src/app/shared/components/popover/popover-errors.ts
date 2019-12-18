/**
 * Exception thrown when popover trigger doesn't have a valid mat-popover instance
 * @docs-private
 */
export function throwMatPopoverMissingError() {
  throw Error(`mat-popover-trigger: must pass in an mat-popover instance.
    Example:
      <mat-popover #popover="matPopover"></mat-popover>
      <button [matPopoverTriggerFor]="popover"></button>`);
}

/**
 * Exception thrown when popover's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
export function throwMatPopoverInvalidPositionX() {
  throw Error(`x-position value must be either 'before' or after'.
    Example: <mat-popover x-position="before" #popover="matPopover"></mat-popover>`);
}

/**
 * Exception thrown when popover's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
export function throwMatPopoverInvalidPositionY() {
  throw Error(`y-position value must be either 'above' or below'.
    Example:<mat-popover y-position="above" #popover="matPopover"></mat-popover>`);
}
