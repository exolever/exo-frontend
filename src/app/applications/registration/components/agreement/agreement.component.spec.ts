import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { of as observableOf } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { ActivatedRouteStub, RouterStub } from '@testing/stubs/router-stubs';
import { UserService } from '@core/services';
import { FakeUserModelFactory } from '@core/faker_factories';
import { UserServiceStub } from '@core/services/stubs';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { TrackingServiceStubProvider } from '@core/services/tracking/tracking.service.stub';

import { InvitationService } from './../../services/invitation.service';
import { FakeAgreementInvitationFactory } from './../../faker_factories/agreement-invitation-fake.model';
import { AgreementComponent } from '../../components/agreement/agreement.component';
import { AgreementDialogComponent } from '../../components/agreement/agreement-dialog/agreement-dialog.component';


class InvitationServiceStub {
  sendAction() {
    return observableOf(true);
  }
  getInvitation() {
    return observableOf(new FakeAgreementInvitationFactory());
  }
}

describe('AgreementComponent', () => {
  let component: AgreementComponent;
  let fixture: ComponentFixture<AgreementComponent>;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testDataParams = { loggedUser: new FakeUserModelFactory() };
    activatedRoute.testParams = { pk: '1' };

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AgreementDialogComponent],
      }
    });
  });

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        TranslateStubModule
      ],
      declarations: [
        AgreementComponent,
        AgreementDialogComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: InvitationService, useClass: InvitationServiceStub },
        { provide: Router, useValue: RouterStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: EarlyParrotService, useValue: { createSubscribe() { return observableOf(); }}},
        CookieService,
        TrackingServiceStubProvider
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show agreement', () => {
    const spy = spyOn(component, 'showAgreement');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
