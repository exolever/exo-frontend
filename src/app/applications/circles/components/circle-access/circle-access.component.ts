import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Circle } from '@circles/models/circle.model';
import { CircleService } from '@circles/services/circle.service';
import {
  RequiredCertificationDialogComponent
} from '@shared/components/dialogs/required-certification-dialog/required-certification-dialog.component';
import { EventParams } from '@core/enums/analytics.enum';

@Component({
  selector: 'app-circle-access',
  templateUrl: './circle-access.component.html',
  styleUrls: ['./circle-access.component.scss']
})
export class CircleAccessComponent {

  circle: Circle;
  url: string;
  isPost: boolean;

  constructor(
    private router: Router,
    private circleService: CircleService,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.circle = navigation.extras.state.circle;
    this.url = navigation.extras.state.url;
    this.isPost = navigation.extras.state.isPost;
  }

  onJoin(circle: Circle) {
    if (circle.everyoneCanJoin()) {
      this.circleService.join(circle.slug).subscribe(() => {
        this.navigate();
      });
    }
    if (circle.needCertificationToJoin()) {
      this.dialog.open(RequiredCertificationDialogComponent, {
        data: {
          certification: circle.certificationRequired,
          prefix: 'ECOSYSTEM.CIRCLES.JOIN',
          source: EventParams.CIRCLES
        },
      });
    }
  }

  private navigate() {
    this.router.navigate([this.url]);
  }

}
