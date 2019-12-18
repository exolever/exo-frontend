import { Injectable } from '@angular/core';

import * as MomentTZ from 'moment-timezone';

import {
  OpportunityActionEnum, OpportunityStatusEnum, OpportunityUserStatusEnum
} from '@ecosystem/modules/opportunities/models/opportunity.enum';
import { getValueEnum } from '@shared/helpers/enum.helper';
import { CertificationsDeserializerService } from '@core/modules/certifications/services';
import { RoleCategoryModel, RoleModel } from '@core/modules/roles/models';
import { LanguageModel } from '@applications/shared/models';

import { OpportunityTarget } from '../../models/opportunity.enum';
import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunityApplicantModel } from '../../models/opportunity-applicant.model';
import { OpportunityRecipientModel } from '../../models/opportunity-recipient.model';
import { UserActionModel } from '../../models/user-action.model';

@Injectable()
export class OpportunitiesSerializerService {

  constructor(
    private certificationsDeserializerService: CertificationsDeserializerService,
  ) { }

  serializeOpportunities(opportunity: any): OpportunityModel {
    const opp = new OpportunityModel(opportunity);
    opp.pk = opportunity.pk;
    opp.subject = opportunity.title;
    opp.location = opportunity.location;
    opp.startDate = opportunity.startDate ? MomentTZ.tz(opportunity.startDate, 'UTC') : undefined;
    opp.deadlineDate = opportunity.deadlineDate ? MomentTZ.tz(opportunity.deadlineDate, 'UTC') : undefined;
    opp.created = MomentTZ.tz(opportunity.created, 'UTC');
    opp.actions = opportunity.userActions ?
      opportunity.userActions.map(action => getValueEnum(OpportunityActionEnum, action)) :
      [];
    opp.userStatus = getValueEnum(OpportunityUserStatusEnum, opportunity.userStatus);
    opp.numApplicants = opportunity.numApplicants ? opportunity.numApplicants : opportunity.newApplicants;
    const requested = opportunity.requestedBy;
    if (requested) {
      opp.requestedBy = new UserActionModel(requested.created, requested.description, requested.user);
    }
    opp.modified = opportunity.modified ? MomentTZ.tz(opportunity.modified, 'UTC') : undefined;
    opp.applicants = this.parseApplicants(opportunity);
    opp.mode = opportunity.mode;
    opp.status = getValueEnum(OpportunityStatusEnum, opportunity.status);
    opp.myApplicant = opportunity.myApplicant ? this.parseApplicant(opportunity.myApplicant) : undefined;
    opp.target = opportunity.target;
    opp.recipients = opportunity.target === OpportunityTarget.TARGETED
      ? this.parseRecipients(opportunity)
      : [];
    opp.duration = opportunity.durationValue;
    opp.durationUnit = opportunity.durationUnity;

    opp.certificationRequired = opportunity.certificationRequired
      ? this.certificationsDeserializerService.deserialize(opportunity.certificationRequired)
      : undefined;

    opp.exoRole = opportunity.exoRole
      ? this.deserializeExORole(opportunity.exoRole)
      : undefined;

    opp.exoCategory = opportunity.exoRole && opportunity.exoRole['categories']
      ? new RoleCategoryModel(opportunity.exoRole['categories'][0])
      : undefined;
    opp.customCategory = opportunity.otherCategoryName;
    opp.customRole = opportunity.otherRoleName;

    opp.mainLanguage = opportunity.languages && opportunity.languages.length > 0
      ? new LanguageModel(opportunity.languages[0].name, opportunity.languages[0].pk)
      : undefined;
    opp.secondaryLanguage = opportunity.languages && opportunity.languages.length > 1
      ? new LanguageModel(opportunity.languages[1].name, opportunity.languages[1].pk)
      : undefined;

    return opp;
  }

  // TODO: Refactor when unify all exoRole with categories and certificationRequired.
  private deserializeExORole(data): RoleModel {
    const role = {
      code: data.code,
      name: data.name
    };
    return new RoleModel(role);
  }

  private parseRecipients(opportunity: any) {
    // We do not receive the usersTagged from the main list in order to be efficient
    return opportunity.usersTagged
      ? opportunity.usersTagged.map(obj => {
          const recipient = new OpportunityRecipientModel(obj);
          if (opportunity.applicants) {
            recipient.applied = opportunity.applicants.some(applicant => applicant.user.uuid === recipient.uuid);
          }
          return recipient;
        })
      : [];
  }

  private parseApplicants(opportunity: any): OpportunityApplicantModel[] {
    return opportunity.applicants
      ? opportunity.applicants.map(dataApplicant => this.parseApplicant(dataApplicant))
      : [];
  }

  private parseApplicant(dataApplicant): OpportunityApplicantModel {
    const newApplicant = new OpportunityApplicantModel(dataApplicant);
    newApplicant.actions = dataApplicant.userActions
      ? dataApplicant.userActions.map(action => getValueEnum(OpportunityActionEnum, action))
      : [];
    return newApplicant;
  }

}
