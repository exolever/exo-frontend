import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { combineReducers, StoreModule } from '@ngrx/store';
import * as MomentTZ from 'moment-timezone';

import { configTestBed } from '@testing/test.common.spec';
import { FakeUserModelFactory } from '@core/faker_factories';
import { UserService, WindowRef } from '@app/core';
import { matDialogRefStubProvider } from '@testing/stubs/mat-dialog-ref-stub';
import { FakeConsultantFactory } from '@applications/shared/faker_factories';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { ConsultantModel } from '@applications/shared/models';
import { typeProjectEnum } from '@applications/service/shared/enums/project.enum';
import * as fromUser from '@core/store/user/user.reducer';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { UserServiceStub } from '@core/services/stubs';

import * as fromProfile from '../../store/user-profile.reducer';
import { ProfileContainerComponent } from './profile-container.component';
import { ProfileViewConfigProvider } from '../../profile-view.config';
import { ProfileEditButtonComponent } from '../../common/profile-edit-button/profile-edit-button.component';

describe('ProfileContainerComponent', () => {
  let component: ProfileContainerComponent;
  let fixture: ComponentFixture<ProfileContainerComponent>;
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
      }),
    ],
    declarations: [
      ProfileContainerComponent,
      ProfileEditButtonComponent,
    ],
    providers: [
      matDialogRefStubProvider,
      ProfileViewConfigProvider,
      WindowRef,
      { provide: UserService, useClass: UserServiceStub },
      { provide: CommunicationService, useValue: {}},
      { provide: BreadCrumbService, useValue: { resetBreadcrumb() {}}},
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return an array of roles without duplicates', () => {
    expect(component.getRolesList()).toEqual([roleName]);
    (<ConsultantModel>component.profileUser).rolesWithProjects[1] = Object.assign({}, rolesWithProjects[0]);
    (<ConsultantModel>component.profileUser).rolesWithProjects[1].roles =
      [{name: 'rol1', code: 'C'}, {name: 'rol1', code: 'C'}, {name: 'rol2', code: 'C'}];
    (<ConsultantModel>component.profileUser).rolesWithProjects[2] = Object.assign({}, rolesWithProjects[0]);
    (<ConsultantModel>component.profileUser).rolesWithProjects[2].roles =
      [{name: 'rol1', code: 'C'}, {name: 'rol1', code: 'C'}, {name: 'rol4', code: 'C'}];
    expect(component.getRolesList()).toEqual([roleName, 'rol1', 'rol2', 'rol4']);

  });

});
