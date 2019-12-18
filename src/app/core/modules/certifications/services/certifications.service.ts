import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@app/core';
import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { UserCertificationModel } from '@core/models/user/user-certification.model';

import { CertificationsDeserializerService } from './certifications-deserializer.service';
import { Languages } from '@applications/ecosystem/components/first-level-certification/enum/languages';

enum CohortLevelEnum {
  CONSULTAT = 'L2',
  SPRINT_COACH = 'L3'
}

@Injectable()
export class CertificationsService {

  constructor(
    private urlService: UrlService,
    private http: HttpClient,
    private certificationsDeserializerService: CertificationsDeserializerService
  ) { }

  getCertifications(): Observable<CertificationModel[]> {
    const apiUrl = this.urlService.resolveAPI(ApiResources.CERTIFICATIONS);
    return this.http.get<CertificationModel[]>(apiUrl).pipe(
      map((res) => this.certificationsDeserializerService.deserialize(res)));
  }

  getCertifiedPeopleByCertification(certificationCode: string) {
    let url = this.urlService.resolveAPI(ApiResources.CERTIFIED_CONSULTANTS);
    url = this.urlService.resolveGetParams(url, ['certifications'], [certificationCode]);
    return this.http.get(url);
  }

  joinCertification(certification: CertificationModel, language = Languages.english) {
    let url: string;
    switch (certification.code) {
      case CertificationEnum.FOUNDATION:
        url = language === Languages.english ? this.urlService.resolveAPI(ApiResources.GET_FIRST_LEVEL_CERTIFICATION_EN)
        : this.urlService.resolveAPI(ApiResources.GET_FIRST_LEVEL_CERTIFICATION_ES);
        break;
      case CertificationEnum.CONSULTANT:
        url = this.urlService.resolveAPI(ApiResources.GET_SECOND_LEVEL_CERTIFICATION);
        break;
      case CertificationEnum.SPRINT_COACH:
        url = this.urlService.resolveAPI(ApiResources.GET_THIRD_LEVEL_CERTIFICATION);
        break;
    }
    return this.http.post(url, {});
  }

  getNextCohorts(code?: CertificationEnum) {
    let url = this.urlService.resolveAPI(ApiResources.COHORTS_GET);
    if (code) {
      url = this.urlService.resolveGetParams(url, ['level'], [this.getCertificationLevel(code)]);
    }
    return this.http.get(url);
  }

  private getCertificationLevel(code: CertificationEnum): string {
    switch (code) {
      case CertificationEnum.CONSULTANT:
        return CohortLevelEnum.CONSULTAT;
      case CertificationEnum.SPRINT_COACH:
        return CohortLevelEnum.SPRINT_COACH;
    }
  }

  getCertificateImage(certification: CertificationModel | UserCertificationModel, enabled: boolean = true) {
    let url;
    switch (certification.code) {
      case CertificationEnum.SPRINT_COACH:
        url = '/assets/certificates/exo-sprint-coach';
        break;
      case CertificationEnum.TRAINER:
        url = '/assets/certificates/exo-trainer';
        break;
      case CertificationEnum.AMBASSADOR:
        url = '/assets/certificates/exo-ambassador';
        break;
      case CertificationEnum.FOUNDATION:
        url = '/assets/certificates/exo-foundations';
        break;
      case CertificationEnum.CONSULTANT:
        url = '/assets/certificates/exo-consultant';
        break;
      case CertificationEnum.BOARD_ADVISOR:
        url = '/assets/certificates/exo-board-advisor';
        break;
      default:
        url = '/assets/certificates/exo-foundations';
        break;
    }
    return enabled ? `${url}.svg` : `${url}-grey.svg`;
  }

  getHelpCenterUrl(certification: CertificationModel) {
    switch (certification.code) {
      case CertificationEnum.FOUNDATION:
        return '/ecosystem/first-level-certification?source=' + origin;
      case CertificationEnum.CONSULTANT:
        return 'https://help.openexo.com/en/articles/3132389-how-to-become-an-exo-consultant';
      case CertificationEnum.SPRINT_COACH:
        return 'https://help.openexo.com/en/articles/3019289-how-to-become-an-exo-coach';
      case CertificationEnum.AMBASSADOR:
        return 'https://help.openexo.com/en/articles/2980158-how-to-become-an-exo-ambassador';
      case CertificationEnum.TRAINER:
        return 'https://help.openexo.com/en/articles/3081574-how-to-become-a-certified-exo-trainer';
      default:
        return '';
    }
  }

  getUrlFormToApplyInWebsite(certification: CertificationModel | UserCertificationModel) {
    switch (certification.code) {
      case CertificationEnum.FOUNDATION:
        return 'https://help.openexo.com/en/articles/3139107-how-to-complete-the-exo-foundations-certification';
      case CertificationEnum.CONSULTANT:
        return 'https://www.openexo.com/exo-consultant-certification';
      case CertificationEnum.SPRINT_COACH:
        return 'https://www.openexo.com/exo-coach-certification';
      default:
        return 'https://www.openexo.com/certifications/#path-section';
    }
  }
}
