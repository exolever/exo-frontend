import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpXsrfTokenExtractor } from '@angular/common/http';

import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { empty } from 'rxjs';

import { LocalStorageService, UrlService } from '@app/core';
import { AppState } from '@core/store/reducers';
import { UrlServiceStub } from '@core/services/stubs';
import { FakeUserModelFactory } from '@core/faker_factories';
import { configTestBed } from '@testing/test.common.spec';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import * as fromUser from '@core/store/user/user.reducer';

import { MyJobsEffect } from '../store/my-jobs.effect';
import { MyJobsService } from '../services/my-jobs.service';
import { MyJobsComponent } from './my-jobs.component';
import * as fromJobs from '../store/my-jobs.reducer';
import * as actionsJobs from '../store/my-jobs.action';


describe('MyJobsComponent', () => {
  let component: MyJobsComponent;
  let fixture: ComponentFixture<MyJobsComponent>;
  let store: Store<AppState>;

  const jobsState: any = {
      entities: {},
      ids: [],
      loading: false,
      pageIndex: undefined,
      count: undefined,
      pageSize: undefined
  };

  const userInitialState: fromUser.UserState = {
    user: new FakeUserModelFactory(),
    loggedIntercom: false
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      EffectsModule.forRoot([MyJobsEffect]),
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('user', fromUser.reducers.user, {initialState: userInitialState} ),
      StoreModule.forFeature(
        'jobs',
        fromJobs.reducer,
        { initialState: jobsState }
      ),
    ],
    declarations: [ MyJobsComponent ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      LocalStorageService,
      { provide: MyJobsService, useValue: { getMyJobsList() {return empty(); } }},
      {
        provide: HttpXsrfTokenExtractor,
        useValue: { getToken() { return ''; } }
      },
      { provide: UrlService, useClass: UrlServiceStub }
    ]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should get the jobs from store', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new actionsJobs.LoadJobs());
  });
});
