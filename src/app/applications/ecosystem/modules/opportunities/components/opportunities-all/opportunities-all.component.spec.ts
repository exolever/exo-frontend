import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { empty } from 'rxjs';

import { configTestBed } from '@testing/test.common.spec';
import { LocalStorageServiceStubProvider, URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { AppState } from '@core/store/reducers';
import { FakeUserModelFactory } from '@core/faker_factories';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import * as fromUser from '@core/store/user/user.reducer';
import { OpportunityDetailService } from '../../services/opportunity-detail.service';
import {
  OpportunitiesListService
} from '@ecosystem/modules/opportunities/services/opportunities-list.service';
import * as opportunitiesAction from '@ecosystem/modules/opportunities/store/actions/opportunities.action';
import { OpportunitiesEffect } from '@ecosystem/modules/opportunities/store/effects/opportunities.effect';
import {
  OpportunitiesSerializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/opportunities-serializer.service';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';

import { OpportunitiesAllComponent } from './opportunities-all.component';
import * as fromOpportunities from '../../store/reducers';
import * as opportunitiesActions from '../../store/actions/opportunities.action';


describe('OpportunitiesAllListComponent', () => {
  let component: OpportunitiesAllComponent;
  let fixture: ComponentFixture<OpportunitiesAllComponent>;
  let store: Store<AppState>;

  const op1 = new OpportunityModel('390');
  op1.pk = 1;
  const op2 = new OpportunityModel('391');
  op2.pk = 2;

  const opportunitiesState: any = {
    opportunities: {
      loading: false,
      loaded: false,
      pageIndex: 1,
      count: 2,
      pageSize: 5,
      search: '',
      ids: ['1', '2'],
      entities: {'1': op1, '2': op2}
    },
    opportunitiesAdmin: {}
  };

  const userInitialState: fromUser.UserState = {
    user: new FakeUserModelFactory(),
    loggedIntercom: false
  };

  const moduleDef: TestModuleMetadata = {
    declarations: [OpportunitiesAllComponent],
    imports: [
      TestingUtilityModule,
      EffectsModule.forRoot([OpportunitiesEffect]),
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('user',
        fromUser.reducers.user,
        {initialState: userInitialState}
      ),
      StoreModule.forFeature('opportunities',
        fromOpportunities.reducers,
        { initialState: opportunitiesState }
      )
    ],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      LocalStorageServiceStubProvider,
      { provide: OpportunitiesListService, useValue: {
          getAllListFromOpportunities() { return empty(); },
          getOpportunities() { return empty(); }
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
      { provide: OpportunitiesSerializerService, useValue: {}},
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitiesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.stub();
    spyOn(store, 'select').and.stub();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should get the opportunities from store', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new opportunitiesActions.LoadOpportunities());
  });

  it('Should toggle loading', () => {
    const action = new opportunitiesAction.LoadOpportunities();
    store.dispatch(action);
    component.loading$.subscribe((res) => {
      expect(res).toBeTruthy();
    });
  });
});
