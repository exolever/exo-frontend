
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CanvasDialogComponent } from './../components/dialogs/canvas-dialog/canvas-dialog.component';
import { BookDialogComponent } from './../components/dialogs/book-dialog/book-dialog.component';
import {
  CertificationsDialogComponent
} from './../components/dialogs/certifications-dialog/certifications-dialog.component';
import {
  FoundationCertificationDialogComponent
} from './../components/dialogs/foundation-certification-dialog/foundation-certification-dialog.component';

@Component({
  templateUrl: './ecosystem.component.html',
  styleUrls: ['./ecosystem.component.scss']
})
export class EcosystemComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if (Object.keys(queryParams).length) {
        const component = this.getDialogComponent(queryParams);
        if (component) {
          this.showDialog(component);
        }
      }
    });
  }

  private showDialog(component: any): void {
    this.dialog.open(component);
  }

  private getDialogComponent(params: any): any {
    switch (true) {
      case params.JOIN_COMMUNITY_FORM === 'true':
      case params.INVITATION === 'true':
        return CertificationsDialogComponent;
      case params.GET_CERTIFIED_FORM === 'true':
        return FoundationCertificationDialogComponent;
      case params.BOOKS_FORM === 'true':
        return BookDialogComponent;
      case params.EXO_CANVAS_FORM === 'true':
        return CanvasDialogComponent;
    }
  }
}
