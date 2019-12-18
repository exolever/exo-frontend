import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { Urls, UserModel } from '@app/core';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import { CertificationRequestModel } from '@core/models/user/certification-request.model';
import * as fromCertifications from '@core/modules/certifications/store/certifications.reducer';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { CertificationModel } from '@core/modules/certifications/models';
import { EventParams } from '@core/enums/analytics.enum';
@Component({
  selector: 'app-certifications-dialog',
  templateUrl: './certifications-dialog.component.html',
  styleUrls: ['./certifications-dialog.component.scss']
})
export class CertificationsDialogComponent implements OnInit, OnDestroy {
  certifications$: Observable<CertificationModel[]>;
  user: UserModel;
  subscriptions = new Subscription;
  consultant: CertificationRequestModel;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<CertificationsDialogComponent>,
  ) { }

  ngOnInit() {
    this.certifications$ = this.store.pipe(
      select((state) => fromCertifications.getCertificationJourney(state.certifications)));
    this.subscriptions.add(
      this.store.pipe(select(state => fromUser.getUser(state)))
        .subscribe(user => {
          this.user = user;
          this.getConsultant();
        })
    );
  }

  goToFoundations() {

    // TODO: ADD QUERYPARAM WITH ENTRY-POINT
    this.router.navigate([Urls.ECOSYSTEM_FIRST_LEVEL], {queryParams: {source: EventParams.ONBOARDING }});
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getConsultant() {
    const consultant = this.user.certificationRequests.find
    ((cert: any) => cert.certificationCode === CertificationEnum.CONSULTANT);
    return consultant;
  }
}
