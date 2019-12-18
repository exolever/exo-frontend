import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BadgeModel, BadgeActivityModel } from '@applications/shared/models/badge.model';
import { RoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  templateUrl: './badge-detail-dialog.component.html'
})
export class BadgeDetailDialogComponent implements OnInit {

  badge: BadgeModel;
  roleEnum = RoleEnum;

  constructor(
    public dialogRef: MatDialogRef<BadgeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { badge: BadgeModel },
  ) { }

  ngOnInit() {
    this.badge = this.data.badge;
    this.sort();
  }

  private sort(): void {
    this.badge.activities.sort((a: BadgeActivityModel, b: BadgeActivityModel ) => {
      if (a.date > b.date) { return -1; }
      if (a.date < b.date) { return 1; }
    });
  }
}
