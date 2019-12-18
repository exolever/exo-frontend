import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';
import { UrlService, UserService } from '@app/core';
import { UrlServiceStub, UserServiceStub } from '@core/services/stubs';
import * as fromUser from '@core/store/user/user.reducer';
import { FakeUserModelFactory } from '@core/faker_factories/user-fake-factory.model';

import { DIRECTORY_CONFIG, directoryConfig } from './directory.conf';
import { DirectoryComponent } from './directory.component';
import * as fromDirectory from './store/directory.reducer';

describe('DirectoryComponent', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;

  const directoryInitialState: fromDirectory.DirectoryState = {
    searchTerms: '',
    pageSize: 12,
    page: directoryConfig.initialPage,
    sortBy: directoryConfig.sortBy,
    order: directoryConfig.order,
    filters: [],
    isLoading: undefined,
    consultants: undefined,
    totalConsultants: undefined
  };

  const userInitialState: fromUser.UserState = {
    user: new FakeUserModelFactory(),
    loggedIntercom: false
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        TranslateStubModule,
        StoreModule.forRoot({}, {
          runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true
          }
        }),
        StoreModule.forFeature('user', fromUser.reducers.user, { initialState: userInitialState }),
        StoreModule.forFeature('directory', fromDirectory.reducer, { initialState: directoryInitialState })
      ],
      declarations: [DirectoryComponent],
      providers: [
        { provide: DIRECTORY_CONFIG, useValue: directoryConfig },
        { provide: UserService, useClass: UserServiceStub },
        { provide: UrlService, useClass: UrlServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
