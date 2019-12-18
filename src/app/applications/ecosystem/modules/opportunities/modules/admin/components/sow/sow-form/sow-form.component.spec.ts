import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
import { StoreModule } from '@ngrx/store';

import { MapsAPILoaderStub } from '@testing/stubs/maps-api-loader-stub';
import { configTestBed } from '@testing/test.common.spec';
import { OverlayReference } from '@overlay/overlay-ref';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import {
  ManagementOpportunityFormService
} from '@applications/ecosystem/modules/opportunities/shared/services/management-opportunity-form.service';
import { SowService } from '@applications/ecosystem/modules/opportunities/shared/services/management-sow.service';
import {
  FakeOpportunityApplicantFactory
} from '@applications/ecosystem/modules/opportunities/faker_factories/opportunityApplicantFake.model';
import { FakeOpportunityFactory } from '@opportunities/faker_factories/opportunityFake.model';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { UrlServiceStub } from '@core/services/stubs';
import { UrlService } from '@app/core/services';
import {
  OpportunitiesFieldSharedServiceProvider
} from '@shared/modules/opportunities-fields-shared/services/opportunities-fields-shared.service-stub';
import {
  SowDeserializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/sow-deserializer.service';
import * as fromUser from '@core/store/user/user.reducer';
import { FakeUserModelFactory } from '@core/faker_factories';
import { OpportunitiesAdminService } from '../../../service/opportunities-admin.service';
import { SowFormComponent } from './sow-form.component';

class ManagementOpportunityFormServiceStub {
  form = new FormGroup({
    mode: new FormControl(),
    locationUrl: new FormControl()
  });
  initializeForm() {}
  isOnSite() {}
  isOnLine() {}
  manageChangesInForm() {}
  getDataToSend() {}
  showLocationErrors () {}
}

describe('SowFormComponent', () => {
  let component: SowFormComponent;
  let fixture: ComponentFixture<SowFormComponent>;
  let service: OpportunitiesAdminService;
  let serviceSow: SowService;

  const userInitialState: fromUser.UserState = {
    user: new FakeUserModelFactory(),
    loggedIntercom: false
  };

  const moduleDef: TestModuleMetadata = {
    declarations: [
      SowFormComponent,
    ],
    imports: [
      TestingUtilityModule,
      CustomMd2DatepickerModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('user', fromUser.reducers.user, {initialState: userInitialState} ),
    ],
    providers: [
      { provide: ManagementOpportunityFormService, useClass: ManagementOpportunityFormServiceStub},
      { provide: MapsAPILoader, useClass: MapsAPILoaderStub },
      { provide: OverlayReference, useValue: { close() {} } },
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: OpportunitiesAdminService, useValue: {
        getDataInitSow(pk: number) { }
      }},
      { provide: SowService, useValue: {
        getDataSow(applicantPk: number) { },
      }},
      OpportunitiesFieldSharedServiceProvider,
      SowDeserializerService,
      ManagementOpportunityFormService
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(SowFormComponent);
    component = fixture.componentInstance;
    component.applicant = new FakeOpportunityApplicantFactory();
    component.opportunity = new FakeOpportunityFactory();
    service = TestBed.get(OpportunitiesAdminService);
    serviceSow = TestBed.get(SowService);
  });

  it ('should initialize for sow', () => {
    const spyInitSow = spyOn(service, 'getDataInitSow').and.returnValue(
      of(new FakeOpportunityApplicantFactory().sow));
    const spyEditSow = spyOn(serviceSow, 'getDataSow').and.returnValue(
      of(new FakeOpportunityApplicantFactory().sow));
    component.ngOnInit();

    component.applicant.sow = undefined;
    component.isEditing = false;
    component.getDataToInitializeForm();
    expect(spyInitSow.calls.count()).toEqual(1);
    expect(spyEditSow.calls.count()).toEqual(0);

    component.isEditing = true;
    component.getDataToInitializeForm();
    expect(spyInitSow.calls.count()).toEqual(1);
    expect(spyEditSow.calls.count()).toEqual(1);
  });

});

