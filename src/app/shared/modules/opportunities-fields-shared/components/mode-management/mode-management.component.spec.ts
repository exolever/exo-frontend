import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MapsAPILoader } from '@agm/core';

import { MapsAPILoaderStub } from '@testing/stubs/maps-api-loader-stub';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import {
  FakeOpportunityFactory
} from '@applications/ecosystem/modules/opportunities/faker_factories/opportunityFake.model';
import { OpportunityMode } from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';
import { PipeModule } from '@shared/pipes/pipes.module';

import { ModeManagementComponent } from './mode-management.component';


describe('ModeManagementComponent', () => {
  let component: ModeManagementComponent;
  let fixture: ComponentFixture<ModeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateStubModule,
        ReactiveFormsModule,
        SharedModule,
        PipeModule
      ],
      declarations: [ ModeManagementComponent ],
      providers: [
        { provide: MapsAPILoader, useClass: MapsAPILoaderStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ModeFields properly', () => {
    const opportunity = new FakeOpportunityFactory();
    opportunity.mode = OpportunityMode.onSite;
    opportunity.location = 'Granada';
    opportunity.placeId = 'XXXXXX';
    component.data = opportunity;
    component.initializeModeFields();
    expect(component.form.get('location').value).toEqual(opportunity.location);
    expect(component.form.get('placeId').value).toEqual(opportunity.placeId);
    expect(component.form.get('mode').value).toEqual(OpportunityMode.onSite);
    expect(component.form.get('location').validator).toBeDefined();
    expect(component.form.get('placeId').validator).toBeDefined();

    opportunity.location = '';
    opportunity.placeId = '';
    opportunity.locationUrl = 'www.google.com';
    opportunity.mode = OpportunityMode.online;
    component.form = new FormGroup({});
    component.data = opportunity;
    component.initializeModeFields();
    expect(component.form.get('locationUrl').value).toEqual(opportunity.locationUrl);
    expect(component.form.get('location').validator).toBeNull();
    expect(component.form.get('placeId').validator).toBeNull();
    expect(component.form.get('mode').value).toEqual(OpportunityMode.online);

    opportunity.location = '';
    opportunity.placeId = '';
    opportunity.locationUrl = '';
    opportunity.mode = OpportunityMode.online;
    component.form = new FormGroup({});
    component.data = opportunity;
    component.initializeModeFields();
    expect(component.form.get('locationUrl').value).toEqual('');
    expect(component.form.get('location').validator).toBeNull();
    expect(component.form.get('placeId').validator).toBeNull();
    expect(component.form.get('mode').value).toEqual(OpportunityMode.online);

    component.form = new FormGroup({});
    component.data = undefined;
    component.initializeModeFields();
    expect(component.form.get('mode').value).toEqual(OpportunityMode.onSite);
  });

});
