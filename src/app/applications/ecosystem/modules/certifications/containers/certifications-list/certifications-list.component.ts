import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';

import { UserModel } from '@app/core';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import * as fromCertifications from '@core/modules/certifications/store/certifications.reducer';
import { CertificationsService } from '@core/modules/certifications/services';
import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { Urls } from '@app/core';
import { Router } from '@angular/router';
import { StatusEnum } from '@applications/certificates/components/certification-cards/certification-cards.enum';
import { EventParams } from '@core/enums/analytics.enum';

@Component({
  templateUrl: './certifications-list.component.html',
  styleUrls: ['./certifications-list.component.scss']
})
export class CertificationsListComponent implements OnInit, OnDestroy {

  certifications$: Observable<CertificationModel[]>;
  user$: Observable<UserModel>;
  subscriptions = new Subscription();
  sprintCoachNextCohorts: any;
  consultantNextCohorts: any;
  statusEnum = StatusEnum;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private certificationsService: CertificationsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.certifications$ = this.store.pipe(
      select((state) => fromCertifications.getCertificationJourney(state.certifications)));
    this.subscriptions.add(
      this.certificationsService.getNextCohorts(CertificationEnum.SPRINT_COACH).subscribe((res) => {
        this.sprintCoachNextCohorts = res;
      }
    ));
    this.subscriptions.add(
      this.certificationsService.getNextCohorts(CertificationEnum.CONSULTANT).subscribe((res) => {
        this.consultantNextCohorts = res;
      }
    ));
  }

  cta(user: UserModel, certification: CertificationModel) {
    if (certification.isFoundation()) {
      const required = this.getCertificationRequest(user, certification);
      if (required && required.status === this.statusEnum.Pending) {
        // const newWindow = window.open('', '_blank');
        const foundations = user.certificationRequests.find(cert => cert.certificationCode === certification.code);
            // newWindow.location.href = foundations.url;
            this.router.navigate([foundations.url]);
      } else {
        this.router.navigate([Urls.ECOSYSTEM_FIRST_LEVEL], {queryParams: {source: EventParams.CERTIFICATIONS }});
      }
    } else {
      window.open(this.certificationsService.getUrlFormToApplyInWebsite(certification), '_blank');
    }
  }

  getNextCohorts(certification: CertificationModel): any[] {
    switch (certification.code) {
      case CertificationEnum.FOUNDATION:
        return [];
      case CertificationEnum.CONSULTANT:
        return this.consultantNextCohorts;
      case CertificationEnum.SPRINT_COACH:
        return this.sprintCoachNextCohorts;
      default:
        return [];
    }
  }

  getImage(certification: CertificationModel, isCertified: boolean) {
    return this.certificationsService.getCertificateImage(certification, isCertified);
  }

  getTitle(certification: CertificationModel) {
    switch (certification.code) {
      case CertificationEnum.FOUNDATION:
        return this.translate.instant('PROFILE.PLATFORM.CERTIFICATIONS.FOUNDATION.TITLE');
      case CertificationEnum.CONSULTANT:
        return this.translate.instant('PROFILE.PLATFORM.CERTIFICATIONS.CONSULTANT.TITLE');
      case CertificationEnum.SPRINT_COACH:
        return this.translate.instant('PROFILE.PLATFORM.CERTIFICATIONS.COACH.TITLE');
    }
  }

  getDescription(certification: CertificationModel) {
    switch (certification.code) {
      case CertificationEnum.FOUNDATION:
        return this.translate.instant('PROFILE.PLATFORM.CERTIFICATIONS.FOUNDATION.DESCRIPTION');
      case CertificationEnum.CONSULTANT:
        return this.translate.instant('PROFILE.PLATFORM.CERTIFICATIONS.CONSULTANT.DESCRIPTION');
      case CertificationEnum.SPRINT_COACH:
        return this.translate.instant('PROFILE.PLATFORM.CERTIFICATIONS.COACH.DESCRIPTION');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getStatus(certification: CertificationModel, user: UserModel) {
    const selectedCert = this.getCertificationRequest(user, certification);
    return selectedCert ? selectedCert.status : selectedCert;
  }

  getCertificationRequest(user: UserModel, certification: CertificationModel) {
    return user.certificationRequests.find(cert => cert.certificationCode === certification.code);
  }

  getButtonText(certification: CertificationModel, user: UserModel) {
    return certification.isFoundation() && this.getStatus(certification, user) === this.statusEnum.Pending ?
      this.translate.instant('ECOSYSTEM.CIRCLES.DIALOG.CERTIFICATIONS.GO_TO_PROJECT') :
      this.translate.instant('ECOSYSTEM.CIRCLES.DIALOG.CERTIFICATIONS.KNOW_MORE');
  }
}
