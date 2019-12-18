import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, Store } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { AppState } from '@core/store/reducers';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { SharedModule } from '@shared/shared.module';
import { OverlayService, DATA } from '@overlay/services/overlay.service';
import { OverlayReference } from '@overlay/overlay-ref';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';
import { KeywordService } from '@applications/shared/services';
import { StubKeywordService } from '@applications/shared/stubs';
import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers/opportunities-admin.reducers';
import * as opportunitiesAction from '@ecosystem/modules/opportunities/store/actions/opportunities.action';

import { OpportunityPreviewComponent } from './opportunity-preview.component';
import { OpportunityDurationUnit } from '../../models/opportunity.enum';


describe('OpportunityPreviewComponent', () => {
  let component: OpportunityPreviewComponent;
  let fixture: ComponentFixture<OpportunityPreviewComponent>;
  let store: Store<AppState>;
  const data = {
    title: 'title',
    opportunity: undefined,
    originalData: {
      data: {
        budgets: [{budget: '500', currency: 'D'}],
        customRole: '',
        deadlineDate: '2019-5-31',
        description: 'Description',
        startDate: '2019-05-31',
        entity: 'Client',
        keywords: [{name: 'A/B Testing', pk: '1'}],
        location: 'Granada, Spain',
        mode: 'S',
        numPositions: '13',
        placeId: 'ChIJfcIyLeb8cQ0Rcg1g0533WJI',
        questions: [],
        role: 'ExO Advisor',
        title: 'New opoortunity',
        typePayment: 0,
        duration: 1,
        durationUnit: OpportunityDurationUnit.HOUR
      },
      baseUrls: {list: '', viewDetails: ''}
    }
  };

  const opportunitiesState: any = {
    opportunities: {
      loading: false,
      loaded: false,
      ids: [],
      pageIndex: 1,
      count: 0,
      pageSize: 5,
      search: '',
      entities: {},
      applicantsSelected: []
    },
    opportunitiesAdmin: {}
  };

  const moduleDef: TestModuleMetadata = {
    declarations: [
      OpportunityPreviewComponent,
    ],
    imports: [
      NoopAnimationsModule,
      SharedModule,
      TranslateStubModule,
      RouterTestingModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('opportunities',
        fromOpportunities.reducer, {initialState: opportunitiesState}
      )
    ],
    providers: [
      { provide: OverlayService, useClass: OverlayServiceStub },
      { provide: OverlayReference, useValue: { close() {} } } ,
      { provide: DATA, useValue: data },
      { provide: KeywordService, useClass: StubKeywordService}
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.stub();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit event emit CreateOpportunity action when is valid', () => {
    const newOpportunity = new opportunitiesAction.CreateOpportunity(data.originalData);
    component.confirm();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(newOpportunity);
  });

});
