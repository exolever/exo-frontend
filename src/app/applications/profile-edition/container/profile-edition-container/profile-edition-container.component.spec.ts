import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule } from '@ngrx/store';

import * as MomentTZ from 'moment-timezone';

import { configTestBed } from '@testing/test.common.spec';
import { FakeConsultantFactory } from '@applications/shared/faker_factories';
import { ProfileViewConfigProvider } from '@applications/profile/profile-view.config';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as fromUser from '@core/store/user/user.reducer';
import { FakeUserModelFactory } from '@core/faker_factories';
import { typeProjectEnum } from '@applications/service/shared/enums/project.enum';

import { ProfileEditionContainerComponent } from './profile-edition-container.component';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

describe('ProfileEditionContainerComponent', () => {
  let component: ProfileEditionContainerComponent;
  let fixture: ComponentFixture<ProfileEditionContainerComponent>;
  const roleName = 'A role name';
  const rolesWithProjects = [{
    badge: { status: 'completed' },
    project: {
      pk: '2',
      name: 'whtever',
      start: MomentTZ.tz(),
      firstDay: MomentTZ.tz(),
      typeProject: typeProjectEnum.Sprint,
      customer: { name: 'random' },
    },
    rating: 3,
    roles: [{ name: roleName, code: 'C' }],
    status: 'C'
  }];
  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      StoreModule.forRoot({
        'user': combineReducers( fromUser.reducers, {
          user: new FakeUserModelFactory().modelPropertiesCustom()
        }),
        'profile': combineReducers( fromProfile.reducers, {
          profile: {
            loading: false,
            currentSlug: undefined,
            user: new FakeConsultantFactory().modelPropertiesCustom(
              [{ name: 'rolesWithProjects', data: rolesWithProjects }]
            )
          }
        })
      }, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
    ],
    declarations: [ProfileEditionContainerComponent],
    providers: [ProfileViewConfigProvider, URL_SERVICE_STUB_PROVIDER],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
