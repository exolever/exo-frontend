import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { EffectRunner, EffectsTestingModule } from '@testing/modules/effects-testing.module';
import { configTestBed } from '@testing/test.common.spec';
import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

import { OpportunitiesListService } from '../../services/opportunities-list.service';
import * as actionOpportunities from '../actions/opportunities.action';
import { OpportunityDetailService } from '../../services/opportunity-detail.service';
import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunitiesEffect } from './opportunities.effect';
import * as fromOpportunities from '../../store/reducers/opportunities-admin.reducers';

describe('OpportunitiesEffect', () => {
  let runnerEffect: EffectRunner;
  let opportunitiesEffect: OpportunitiesEffect;
  let serviceList: OpportunitiesListService;
  let serviceDetail: OpportunityDetailService;

  const opportunity: OpportunityModel = new OpportunityModel({pk: '2'});
  const opportunitiesState: any = {
    opportunities: {
      loading: false,
      loaded: true,
      applicantsSelected: undefined,
      pageIndex: 1,
      count: 1,
      pageSize: 5,
      search: '',
      ids: ['2'],
      entities: {'2': opportunity }
    },
    opportunitiesAdmin: {}
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      EffectsTestingModule,
      TranslateStubModule,
      RouterTestingModule,
      MatSnackBarModule,
      NoopAnimationsModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('opportunities',
        fromOpportunities.reducer,
        { initialState: opportunitiesState }
      )
    ],
    providers: [
      TranslateService,
      { provide: OpportunitiesListService, useValue: {
          getAllListFromOpportunities() {},
          getOpportunities() {}
        }
      },
      {
        provide: OpportunityDetailService,
        useValue: {
          create() {},
          applyOpportunity() {},
          getAdvisorRequestDetail() {},
          getOpportunityDetail() {},
          delete() {},
          edit() {},
          acceptSow () {},
          declineSow () {}
        }
      },
      OpportunitiesEffect,
      URL_SERVICE_STUB_PROVIDER,
      { provide: OverlayService, useClass: OverlayServiceStub },
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(inject([EffectRunner, OpportunitiesEffect], (runner, effect) => {
    serviceList = TestBed.get(OpportunitiesListService);
    serviceDetail = TestBed.get(OpportunityDetailService);
    runnerEffect = runner;
    opportunitiesEffect = effect;
  }));

  it('Should return a CREATE_OPPORTUNITY_SUCCESS after OK execute a CREATE_OPPORTUNITY', () => {
    spyOn(serviceDetail, 'create').and.returnValue(observableOf(opportunity));

    runnerEffect.queue({type: actionOpportunities.CREATE_OPPORTUNITY});

    opportunitiesEffect.creating$.subscribe((result: any) => {
      expect(serviceDetail.create).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunities.CREATE_OPPORTUNITY_SUCCESS);
    });
  });

  it('Should return a APPLY_OPPORTUNITY_SUCCESS after OK execute a APPLY_OPPORTUNITY', () => {
    spyOn(serviceDetail, 'applyOpportunity').and.returnValue(observableOf(opportunity));

    opportunitiesEffect.applying$.subscribe((result: any) => {
      expect(serviceDetail.applyOpportunity).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunities.APPLY_OPPORTUNITY_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunities.APPLY_OPPORTUNITY,
      payload: {pkOpportunity: 1, dataToSend: 'none'}
    });
  });

  it('Should return a LOAD_OPPORTUNITIES_BY_YOU_SUCCESS after OK execute a LOAD_OPPORTUNITIES_BY_YOU', () => {
    const spy = spyOn(serviceList, 'getOpportunities').and.returnValue(observableOf({
      results: [opportunity],
      count: '1',
      next: '',
      previous: ''
    }));

    opportunitiesEffect.loadingByYou$.subscribe((result: any) => {
      expect(spy).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunities.LOAD_OPPORTUNITIES_BY_YOU_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunities.LOAD_OPPORTUNITIES_BY_YOU
    });
  });

  it('Should return a LOAD_OPPORTUNITY_SUCCESS after OK execute a LOAD_OPPORTUNITY', () => {
    spyOn(serviceDetail, 'getOpportunityDetail').and.returnValue(observableOf(opportunity));

    opportunitiesEffect.loadingOpportunityDetail$.subscribe((result: any) => {
      expect(serviceDetail.getOpportunityDetail).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunities.LOAD_OPPORTUNITY_SUCCESS);
    });

    runnerEffect.queue({
      type: actionOpportunities.LOAD_OPPORTUNITY,
      payload: { pk: '1'}
    });
  });

  it('Should return a DELETE_OPPORTUNITY_SUCCESS after OK execute a DELETE_OPPORTUNITY', () => {
    spyOn(serviceDetail, 'delete').and.returnValue(undefined);
    opportunitiesEffect.deleting$.subscribe((result: any) => {
      expect(serviceDetail.delete).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunities.DELETE_OPPORTUNITY_SUCCESS);
    });
    runnerEffect.queue({
      type: actionOpportunities.DELETE_OPPORTUNITY_SUCCESS,
      payload: {pkOpportunity: 1}
    });
  });

  it('Should return a EDIT_OPPORTUNITY_SUCCESS after OK execute an EDIT_OPPORTUNITY', () => {
    spyOn(serviceDetail, 'edit').and.returnValue(observableOf(opportunity));
    opportunitiesEffect.editing$.subscribe((result: any) => {
      expect(serviceDetail.edit).toHaveBeenCalled();
      expect(result.type).toEqual(actionOpportunities.EDIT_OPPORTUNITY_SUCCESS);
    });
    runnerEffect.queue({
      type: actionOpportunities.EDIT_OPPORTUNITY_SUCCESS,
      payload: opportunity
    });
  });

});

