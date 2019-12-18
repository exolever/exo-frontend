import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityModel } from '@applications/shared/models';

@Component({
  selector: 'app-toggle-item',
  templateUrl: './toggle-item.component.html',
  styleUrls: ['./toggle-item.component.scss']
})
export class ToggleItemComponent {

  @Input()
  item: ActivityModel;

  @Input()
  status: boolean;

  @Input()
  disabled = false;

  @Output()
  toggle = new EventEmitter();

  changeStatus(status) {
    this.item.status = status.checked;
    this.toggle.emit(this.item);
  }
}
