import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { configTestBed } from '@testing/test.common.spec';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { ProfileEffect } from '@applications/profile/store/user-profile.effect';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';
import {
  userAndConsultantResponseDigestStubServiceProvider
} from '@applications/profile/services/stubs/user-and-consultant-response-digest-stub.service';
import * as fromProfileUser from '@applications/profile/store/user-profile.reducer';

import { ExoFramerComponent } from './exo-framer.component';
import { profileEditSnackBarServiceStubProvider } from '../../testing/snack-bar-service-stub';

const initialState: any = {
  profile:  {
    user: new FakeConsultantFactory().modelPropertiesCustom(),
    currentSlug: 'some-slug',
    loading: false
  }
};

describe('ExoFramerComponent', () => {
  let component: ExoFramerComponent;
  let fixture: ComponentFixture<ExoFramerComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      EffectsModule.forRoot([ProfileEffect]),
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('profile', fromProfileUser.reducers.profile, { initialState: initialState })
    ],
    declarations: [
      ExoFramerComponent,
    ],
    providers: [
      userAndConsultantResponseDigestStubServiceProvider,
      profileEditSnackBarServiceStubProvider,
      URL_SERVICE_STUB_PROVIDER,
      ProfileEditionService
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ExoFramerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
