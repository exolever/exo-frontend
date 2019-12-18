import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle-form',
  templateUrl: './toggle-form.component.html',
  styleUrls: ['./toggle-form.component.scss']
})
export class ToggleFormComponent implements OnDestroy {

  @Input() form: FormGroup;
  @Input() list: any[];
  @Output() submitted = new EventEmitter<FormGroup>();
  @Output() onToggleItem = new EventEmitter<FormGroup>();

  dirty: boolean;

  constructor() {}

  onSubmit() {
    if (this.form.valid) {
      this.dirty = false;
      this.submitted.emit(this.form);
    }
  }

  onToggle(item) {
    this.onToggleItem.emit();
    this.dirty = true;
    this.form.markAsDirty();
    this.form.get(item.code).setValue(item.status);
  }

  ngOnDestroy() {
    this.form.reset();
  }
}
