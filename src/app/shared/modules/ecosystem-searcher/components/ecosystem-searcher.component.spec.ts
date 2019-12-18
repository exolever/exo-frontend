import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { PipeModule } from '@shared/pipes/pipes.module';
import { StubConsultantListService } from '@applications/shared/stubs/consultant-list.service-stub';
import { ConsultantListService } from '@applications/shared/services/consultant-list.service';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';
import { UserService } from '@core/services';
import { UserServiceStub } from '@core/services/stubs';

import { EcosystemSearcherComponent } from './ecosystem-searcher.component';
import { IEcosystemSearcherConsultantOptions } from '../ecosystem-searcher-result.interface';

describe('EcosystemSearcherComponent', () => {
  let component: EcosystemSearcherComponent;
  let fixture: ComponentFixture<EcosystemSearcherComponent>;
  const mockElementRef: any = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateStubModule,
        MatAutocompleteModule,
        PipeModule
      ],
      declarations: [
        EcosystemSearcherComponent
      ],
      providers: [
        TranslateService,
        { provide: ConsultantListService, useClass: StubConsultantListService },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ElementRef, useValue: mockElementRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcosystemSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not allow adding new consultant once reached the maximum', () => {
    component.maxResults = 3;
    fixture.detectChanges();
    expect(component.canAddConsultant()).toBeTruthy();
    component.consultants = [
      new FakeConsultantFactory(),
      new FakeConsultantFactory(),
      new FakeConsultantFactory()
    ];
    expect(component.canAddConsultant()).toBeFalsy();
  });

  it('should replace the consultant value when the maximum is 1', () => {
    component.maxResults = 1;
    component.consultants = [new FakeConsultantFactory()];
    expect(component.canAddConsultant()).toBeTruthy();
  });

  it('should build the consultant items taking into account the extra options', () => {
    const consultants = [new FakeConsultantFactory(), new FakeConsultantFactory()];
    const extraOptions = [
      <IEcosystemSearcherConsultantOptions>{
        consultantPk: consultants[0].uuid,
        canBeDeleted: true,
        template: undefined
      },
      <IEcosystemSearcherConsultantOptions>{
        consultantPk: consultants[1].uuid,
        canBeDeleted: false,
        template: mockElementRef
      }
    ];
    component.consultants = consultants;
    component.consultantsExtraOptions = extraOptions;
    component.ngOnChanges({});

    expect(component.searcherConsultantItems[0].canBeDeleted).toBeTruthy();
    expect(component.searcherConsultantItems[0].template).toBeUndefined();
    expect(component.searcherConsultantItems[1].canBeDeleted).toBeFalsy();
    expect(component.searcherConsultantItems[1].template).not.toBeUndefined();
  });

  it('should validate the field when the maximum is reached', () => {
    component.maxResults = 2;
    component.consultants = [new FakeConsultantFactory(), new FakeConsultantFactory()];
    component.onAdd(new FakeConsultantFactory());
    expect(component.searchField.hasError('autocompleteMaxItemsValidator')).toBeTruthy();
  });

  it('should add new element to the consultant list when the maxResults is bigger than 1', () => {
    component.maxResults = 2;
    component.consultants = [new FakeConsultantFactory()];
    const $event = {'option': {'value': new FakeConsultantFactory()}};
    component.onAdd($event);
    expect(component.consultants.length).toBe(2);
  });

  it('should replace the consultant when the maxResults is 1', () => {
    component.maxResults = 1;
    component.consultants = [new FakeConsultantFactory()];
    const $event = {'option': {'value': new FakeConsultantFactory()}};
    component.onAdd($event);
    expect(component.consultants.length).toBe(1);
  });
});
