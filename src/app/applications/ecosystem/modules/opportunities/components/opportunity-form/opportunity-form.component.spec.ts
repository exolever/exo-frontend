import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { MapsAPILoader } from '@agm/core';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { MapsAPILoaderStub } from '@testing/stubs/maps-api-loader-stub';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { configTestBed } from '@testing/test.common.spec';
import { AppState } from '@core/store/reducers';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { SharedModule } from '@shared/shared.module';
import { KeywordService } from '@applications/shared/services';
import { StubKeywordService } from '@applications/shared/stubs';
import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers/opportunities-admin.reducers';
import * as opportunitiesAction from '@ecosystem/modules/opportunities/store/actions/opportunities.action';
import {
  MarketPlaceService
} from '@applications/ecosystem/components/marketplace-conditions/marketplace-contitions.service';
import { CertificationsService } from '@core/modules/certifications/services';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { OpportunitiesAdminService } from '@opportunities/modules/admin/service/opportunities-admin.service';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RoleCategoryEnum } from '@core/modules/roles/enums';
import {
  OpportunitiesFieldSharedServiceProvider
} from '@shared/modules/opportunities-fields-shared/services/opportunities-fields-shared.service-stub';

import {
  OpportunityDurationUnit, OpportunityMode, OpportunityTypePayment, OpportunityTarget
} from '../../models/opportunity.enum';
import { OpportunityFormComponent } from './opportunity-form.component';
import { FakeOpportunityFactory } from '../../faker_factories/opportunityFake.model';
import { ManagementOpportunityFormService } from '../../shared/services/management-opportunity-form.service';


xdescribe('OpportunityFormComponent', () => {
  let component: OpportunityFormComponent;
  let fixture: ComponentFixture<OpportunityFormComponent>;
  let store: Store<AppState>;
  const google = {
    maps() {}
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
      OpportunityFormComponent,
    ],
    imports: [
      NoopAnimationsModule,
      ReactiveFormsModule,
      SharedModule,
      TranslateStubModule,
      CustomMd2DatepickerModule,
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
      FormBuilder,
      ManagementOpportunityFormService,
      { provide: OpportunitiesAdminService, useValue: {
        getRoles() { return of(); }
      } },
      { provide: MapsAPILoader, useClass: MapsAPILoaderStub },
      { provide: KeywordService, useClass: StubKeywordService },
      { provide: MarketPlaceService, useValue: {} },
      { provide: CertificationsService, useValue: {} },
      { provide: EarlyParrotService, useValue: {} },
      OpportunitiesFieldSharedServiceProvider
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.stub();
    spyOn(google, 'maps').and.returnValue(undefined);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit event emit PreviewOpportunity action when is valid', () => {
    const newOpportunity = new opportunitiesAction.PreviewOpportunity({
      data: {
        title: 'title',
        entity: 'entity',
        description: 'description',
        startDate: '1900-01-01',
        deadlineDate: '2021-10-10',
        numPositions: 2,
        keywords: ['a'],
        target: OpportunityTarget.OPEN,
        typePayment: 0,
        questions: [{ title: 'question 1'}, {title: 'question 2' } ],
        mode: 'S',
        location: 'location',
        placeId: 'placeId',
        budgets: [{budget: 300, currency: 'E'}],
        durationValue: 1,
        durationUnity: OpportunityDurationUnit.HOUR,
        role: 'OT',
        category: RoleCategoryEnum.SPRINT,
        certification: CertificationEnum.FOUNDATION,
      },
      baseUrls: {list: '', viewDetails: ''}
    });
    component.form.setValue({
      title: 'title',
      entity: 'entity',
      numPositions: 2,
      description: 'description',
      mode: OpportunityMode.onSite,
      location: 'location',
      placeId: 'placeId',
      startDate: new Date('1/1/1900'),
      deadlineDate: new Date('2021/10/10'),
      keywords: ['a'],
      target: OpportunityTarget.OPEN,
      recipients: [],
      typePayment: OpportunityTypePayment.single,
      locationUrl: 'http://www.google.com',
      questions: ['question 1', 'question 2', ''],
      budgets: [{budget: 300, currency: 'E'}, {budget: 500, currency: 'X'}],
      duration: 1,
      durationUnit: OpportunityDurationUnit.HOUR,
      category: RoleCategoryEnum.SPRINT,
      certification: CertificationEnum.FOUNDATION,
      role: 'OT',
    });
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(newOpportunity);
  });

  it('submit event emit EditOpportunity action when is valid', () => {
    component.opportunity = new FakeOpportunityFactory();
    component.opportunity.questions = [
      {id: 1, title: 'Question 1'},
      {id: 2, title: 'Question 2'},
      {id: 3, title: 'Question 3'}
    ];

    const dataOpportunity = {
      opportunityPk: component.opportunity.pk,
      data: {
        title: 'title',
        entity: 'entity',
        description: 'description',
        startDate: '1900-01-01',
        deadlineDate: '2021-10-10',
        numPositions: 2,
        keywords: ['a'],
        target: OpportunityTarget.OPEN,
        typePayment: 0,
        role: 'Teacher',
        roleCode: 'OT',
        questions: component.opportunity.questions,
        mode: 'S',
        location: 'location',
        placeId: 'placeId',
        budgets: [{budget: 300, currency: 'E'}],
        durationValue: 1,
        durationUnity: OpportunityDurationUnit.HOUR
      }
    };
    component.form.setValue({
      title: 'title',
      entity: 'entity',
      numPositions: 2,
      description: 'description',
      mode: OpportunityMode.onSite,
      location: 'location',
      placeId: 'placeId',
      startDate: new Date('1/1/1900'),
      deadlineDate: new Date('2021/10/10'),
      keywords: ['a'],
      target: OpportunityTarget.OPEN,
      recipients: [],
      typePayment: OpportunityTypePayment.single,
      locationUrl: 'http://www.google.com',
      questions: ['Question 1', 'Question 2', 'Question 3'],
      budgets: [ {budget: 300, currency: 'E'}, {budget: 500, currency: 'X'}],
      duration: 1,
      durationUnit: OpportunityDurationUnit.HOUR,
      category: RoleCategoryEnum.SPRINT,
      certification: CertificationEnum.FOUNDATION,
      role: 'OT',
    });
    const getUpdateSpy = spyOn(component, 'notifyByEmail').and.returnValue(of(undefined));
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      new opportunitiesAction.EditOpportunity(
        {
          opportunityPk: 1,
          data: {...dataOpportunity.data, ...{sendNotification: false}},
          baseUrlViewDetails: ''
        }
      )
    );
    getUpdateSpy.and.returnValue(of(true));
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      new opportunitiesAction.EditOpportunity(
        {
          opportunityPk: 1,
          data: {...dataOpportunity.data, ...{sendNotification: true}},
          baseUrlViewDetails: ''
        }
      )
    );
    getUpdateSpy.and.returnValue(of('comment'));
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      new opportunitiesAction.EditOpportunity(
        {
          opportunityPk: 1,
          data: {...dataOpportunity.data, ...{sendNotification: true, comment: 'comment'}},
          baseUrlViewDetails: ''
        }
      )
    );
  });

  it('submit event does NOT emit any action when is invalid', () => {
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should initialize basic form properly', () => {
    const opportunity = new FakeOpportunityFactory();
    component.opportunity = opportunity;
    component.initializeForm();
    expect(component.form.get('title').value).toEqual(opportunity.subject);
    expect(component.form.get('entity').value).toEqual(opportunity.entity);
    expect(component.form.get('description').value).toEqual(opportunity.description);
    expect(component.form.get('startDate').value).toEqual(opportunity.startDate);
    expect(component.form.get('numPositions').value).toEqual(opportunity.numPositions);
    expect(component.form.get('duration').value).toEqual(opportunity.duration);
    expect(component.form.get('keywords').value).toEqual(opportunity.keywords);
    expect(component.form.get('deadlineDate').value).toEqual(opportunity.deadlineDate.toDate());
  });

});
