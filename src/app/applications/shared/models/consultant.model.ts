import { getValueEnum } from '@shared/helpers/enum.helper';
import { ExOActivityStatusEnum } from '@applications/shared/enums';
import { BadgeModel } from '@applications/shared/models/badge.model';

import { UserApplicationModel } from './user-application.model';
import { LanguageModel } from './language.model';
import { ActivityModel } from './activity.model';
import { IExOAttribute } from '../interfaces/';
import { ProjectsRoles } from '../interfaces/projects-roles.interface';
import { IndustryModel } from './industry.model';
import { KeywordModel } from './keyword.model';
import { ConsultantStatusEnum } from '../enums/consultant-status.enum';
import { CH_EXTERNAL_EXO_ATTRIBUTE, CH_INTERNAL_EXO_ATTRIBUTE } from '../interfaces/exo-attribute.interface';

export class ConsultantModel extends UserApplicationModel {

  activities: Array<ActivityModel>;
  areasExpertise: Array<string>;
  availability: string;
  availabilityHours: number;
  badgesActivity: Array<BadgeModel> = [];
  consultantPermissions: Array<string>;
  consultantStatus: ConsultantStatusEnum;
  exoAreas: String[] = [];
  exoAttributes: Array<IExOAttribute> = [];
  expertises: KeywordModel[] = [];
  industries: Array<IndustryModel>;
  isCertified: boolean;
  keywords: KeywordModel[] = [];
  languages: Array<LanguageModel>;
  legalAddress: String;
  legalCompanyName: String;
  legalName: String;
  mtp: string;
  pkConsultant: string;
  projectsNumber: number;
  profileUrl: string;
  purpose: string;
  rolesWithProjects: Array<ProjectsRoles>;
  taxId: number;
  technologies: KeywordModel[] = [];
  thumbnail: string;
  valueMTP: number;
  video: string;

  constructor(pk: string, initializer?: any) {
    super(pk, initializer);
    if (initializer && initializer['consultant']) {
      Object.keys(initializer['consultant']).forEach(key => {
        this[key] = initializer['consultant'][key];
      });
    }
  }

  setIndustries(industries: Array<IndustryModel>) {
    this.industries = industries;
  }

  setLanguages(languages: Array<LanguageModel>) {
    this.languages = languages;
  }

  setPkConsultant(pkConsultant: string) {
    this.pkConsultant = pkConsultant;
  }

  setPermissions(permissions: Array<string>): void {
    if (this.permissions) {
      this.permissions = this.permissions.concat(permissions);
    } else {
      this.permissions = permissions;
    }
  }

  setLegalData(info) {
    if (info.hasOwnProperty('name')) {
      this.legalName = info['name'];
    }

    if (info.hasOwnProperty('address')) {
      this.legalAddress = info['address'];
    }

    if (info.hasOwnProperty('companyName')) {
      this.legalCompanyName = info['companyName'];
    }

    if (info.hasOwnProperty('taxId')) {
      this.taxId = info['taxId'];
    }
  }

  setVideo(video: string): void {
    this.video = video;
  }

  getLanguages(): Array<LanguageModel> {
    return this.languages;
  }

  hasLanguages(): boolean {
    return this.languages ? this.languages.length > 0 : false;
  }

  hasAreasExpertise(): boolean {
    return this.areasExpertise ? this.areasExpertise.length > 0 : false;
  }

  hasIndustries(): boolean {
    return this.industries ? this.industries.length > 0 : false;
  }

  getExoArea(exoArea: string) {
    return this.exoAreas.indexOf(exoArea) > -1;
  }

  getInternalEXOAttributes(): Array<IExOAttribute> {
    /**
     * we need to reverse the string in order to achieve the right effect of both words displayed top-bottom in chart
     */
    const ideasOrder = 'IDEAS'.split('').reverse().join('');

    return this.exoAttributes
      .filter(attr => attr.type === CH_INTERNAL_EXO_ATTRIBUTE)
      .sort((a, b) => ideasOrder.indexOf(a.name.substring(0, 1)) - ideasOrder.indexOf(b.name.substring(0, 1)));
  }

  getExternalEXOAttributes(): Array<IExOAttribute> {
    const scaleOrder = 'SCALE';

    return this.exoAttributes
      .filter(attr => attr.type === CH_EXTERNAL_EXO_ATTRIBUTE)
      .sort((a, b) => scaleOrder.indexOf(a.name.substring(0, 1)) - scaleOrder.indexOf(b.name.substring(0, 1)));
  }

  getActivities(): ActivityModel[] {
    return this.activities ? this.activities.filter(activity =>
      activity.status === getValueEnum(ExOActivityStatusEnum, ExOActivityStatusEnum.A)) : [];
  }

  isActive(): boolean {
    return this.consultantStatus === ConsultantStatusEnum.A;
  }

}
