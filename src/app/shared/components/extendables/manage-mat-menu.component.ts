export abstract class ManageMatMenuComponent {
  tooltipDisabled = false;
  stopPropagation($event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  // this function disabled the tooltip of the button for a short span of time to avoid
  // that it appears after menu closed, more info on the issue page: https://goo.gl/ZD7wXV
  onMenuClosed() {
    this.tooltipDisabled = true;
    setTimeout(() => { this.tooltipDisabled = false; }, 50 );
  }

}
