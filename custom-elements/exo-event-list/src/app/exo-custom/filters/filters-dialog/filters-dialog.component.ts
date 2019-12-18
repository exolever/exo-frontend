import { Component, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Event } from '../../event.model';
import { IFilters } from '../../filter.interface';

@Component({
  templateUrl: './filters-dialog.component.html'
})
export class FiltersDialogComponent {
  appliedFilters: any;
  constructor(
    private dialogRef: MatDialogRef<FiltersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      events: Event[],
      selectedFilters: IFilters
      languageOptions: string[],
      countryOptions: string[]
    }
  ) {}

  selectedOptions(selected) {
    this.appliedFilters = selected;
  }

  applyFilters() {
    this.dialogRef.close(this.appliedFilters);
  }
  close() {
    this.dialogRef.close();
  }

}
