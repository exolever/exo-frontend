import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-refresh-announce',
  templateUrl: './refresh-announce.component.html',
  styleUrls: ['./refresh-announce.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefreshAnnounceComponent {
  @Input() message: string;
  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

  /**
   * propagates to parent component the refresh event
   */
  emitRefresh() {
    this.refresh.emit();
  }
}
