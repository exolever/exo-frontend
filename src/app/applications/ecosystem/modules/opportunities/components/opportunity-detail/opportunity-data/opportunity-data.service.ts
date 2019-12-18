import { Injectable } from '@angular/core';

import { LanguageEnum } from '@core/enums';

@Injectable()
export class OpportunityDataService {

  getAdvisorCallRequesterGuidelinesUrl(language: LanguageEnum): string {
    return language === LanguageEnum.ENGLISH
      ? 'http://help.openexo.com/en/articles/3486770-advisory-call-requester-guidelines'
      : 'http://help.openexo.com/en/articles/3489934-advisory-call-pautas-para-el-solicitante';
  }

  getAdvisorCallApplicantGuidelinesUrl(language: LanguageEnum): string {
    return language === LanguageEnum.ENGLISH
      ? 'http://help.openexo.com/en/articles/3486763-advisory-call-advisor-guidelines'
      : 'http://help.openexo.com/en/articles/3490030-advisory-call-pautas-para-el-asesor';
  }

}
