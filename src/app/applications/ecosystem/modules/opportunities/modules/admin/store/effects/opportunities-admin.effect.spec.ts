import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import {
  OpportunityApplicantModel
} from '@applications/ecosystem/modules/opportunities/models/opportunity-applicant.model';
import {
OpportunitiesAdminEffect
} from '@ecosystem/modules/opportunities/modules/admin/store/effects/opportunities-admin.effect';
import {
OpportunitiesAdminService
} from '@ecosystem/modules/opportunities/modules/admin/service/opportunities-admin.service';
import { OpportunityModel} from '@ecosystem/modules/opportunities/models/opportunity.model';
import { EffectRunner, EffectsTestingModule} from '@testing/modules/effects-testing.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import { FakeOpportunityApplicantFactory } from '@opportunities/faker_factories/opportunityApplicantFake.model';

import * as actionOpportunitiesAdmin from '../actions/opportunities-admin.action';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

describe('OpportunitiesAdminEffect', () => {
  let runnerEffect: EffectRunner;
  let opportunitiesAdminEffect: OpportunitiesAdminEffect;
  let serviceAdmin: OpportunitiesAdminService;

  const opportunity: OpportunityModel = new OpportunityModel({ pk: '2' });

  const moduleDef: TestModuleMetadata = {
    imports: [
      EffectsTestingModule,
      TranslateStubModule,
      RouterTestingModule,
      MatSnackBarModule,
      NoopAnimationsModule
    ],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      OpportunitiesAdminEffect,
      {
        provide: OpportunitiesAdminService, useValue: {
          getOpportunityDetailAdmin(pk: string) {},
          selectApplicant(applicantPk: number, opportunityPk: number, message: string) {},
          rejectApplicant(applicantPk: number, opportunityPk: number, message: string) {},
          closeOpportunity(pk: string) {},
          editSow(applicant: OpportunityApplicantModel, sow: any, message: string) {}
        }
      },
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(inject([EffectRunner, OpportunitiesAdminEffect], (runner, effect) => {
    serviceAdmin = TestBed.get(OpportunitiesAdminService);
    runnerEffect = runner;
    opportunitiesAdminEffect = effect;
  }));

  it('Should return a CLOSE_OPPORTUNITY_SUCCESS after OK execute a CLOSE_OPPORTUNITY', () => {
    spyOn(serviceAdmin, 'closeOpportunity').and.returnValue(observableOf(opportunity));

    opportunitiesAdminEffect.closeOpportunity$.subscribe((result: any) => {
      expect(serviceAdmin.closeOpportunity).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunitiesAdmin.CLOSE_OPPORTUNITY_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunitiesAdmin.CLOSE_OPPORTUNITY,
      payload: { pk: '1'}
    });
  });

  it('Should return a OPPORTUNITY_SELECT_APPLICANT_SUCCESS after OK execute a OPPORTUNITY_SELECT_APPLICANT', () => {
    spyOn(serviceAdmin, 'selectApplicant').and.returnValue(observableOf(opportunity));
    opportunitiesAdminEffect.selectApplicant$.subscribe((result: any) => {
      expect(serviceAdmin.selectApplicant).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunitiesAdmin.OPPORTUNITY_SELECT_APPLICANT_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunitiesAdmin.OPPORTUNITY_SELECT_APPLICANT,
      payload: {
        applicant: new FakeOpportunityApplicantFactory(),
        opportunityPk: opportunity.pk,
        message: 'message'
      }
    });
  });

  it('Should return a OPPORTUNITY_REJECT_APPLICANT_SUCCESS after OK execute a OPPORTUNITY_REJECT_APPLICANT', () => {
    spyOn(serviceAdmin, 'rejectApplicant').and.returnValue(observableOf(opportunity));

    opportunitiesAdminEffect.rejectApplicant$.subscribe((result: any) => {
      expect(serviceAdmin.rejectApplicant).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunitiesAdmin.OPPORTUNITY_REJECT_APPLICANT_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunitiesAdmin.OPPORTUNITY_REJECT_APPLICANT,
      payload: {
        applicant: new FakeOpportunityApplicantFactory(),
        opportunityPk: '1',
        message: 'message'
      }
    });
  });

  it('Should return a LOAD_OPPORTUNITY_SUCCESS after OK execute a LOAD_OPPORTUNITY_ADMIN', () => {
    spyOn(serviceAdmin, 'getOpportunityDetailAdmin').and.returnValue(observableOf(opportunity));

    opportunitiesAdminEffect.loadingOpportunityDetailAdmin$.subscribe((result: any) => {
      expect(serviceAdmin.getOpportunityDetailAdmin).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunitiesAdmin.LOAD_OPPORTUNITY_ADMIN_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunitiesAdmin.LOAD_OPPORTUNITY_ADMIN,
      payload: { pk: '1'}
    });
  });

  it('Should return a EDIT_SOW_SUCCESS after OK execute a EDIT_SOW', () => {
    spyOn(serviceAdmin, 'editSow').and.returnValue(observableOf(opportunity));

    opportunitiesAdminEffect.editSow$.subscribe((result: any) => {
      expect(serviceAdmin.editSow).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunitiesAdmin.EDIT_SOW_SUCCESS);
    });

    const applicant = new FakeOpportunityApplicantFactory();
    runnerEffect.queue({
      type: actionOpportunitiesAdmin.EDIT_SOW,
      payload: {
        applicant: applicant,
        sow: applicant.sow,
        message: 'message'
      }
    });
  });

});
