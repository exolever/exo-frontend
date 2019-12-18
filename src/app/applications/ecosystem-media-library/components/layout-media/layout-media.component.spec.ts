import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, combineReducers } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { DATA } from '@overlay/services/overlay.service';
import { FakeUserModelFactory } from '@core/faker_factories';
import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { UserService } from '@core/services';
import { UserServiceStub } from '@core/services/stubs';
import { MOCK_DEFAULT_OVERLAY_CONFIG } from '@overlay/services/overlay.service.stub';

import * as fromMediaLibrary from '../../store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import { LayoutMediaComponent } from './layout-media.component';
import { MediaFiltersComponent } from '../media-filters/media-filters.component';
import {MediaLibraryConfigProvider} from '@ecosystem-media-library/ecosystem-media-library.conf';



@Component({
  selector: 'app-search',
  template: ''
})
class SearchMockComponent { }

@Component({
  selector: 'app-media-grid',
  template: ''
})
class MediaGridMockComponent {}
describe('LayoutMediaComponent', () => {
  let component: LayoutMediaComponent;
  let fixture: ComponentFixture<LayoutMediaComponent>;
  let dialog: MatDialog;

  const moduleDef: TestModuleMetadata = {
    declarations: [
      LayoutMediaComponent,
      SearchMockComponent,
      MediaGridMockComponent,
      MediaFiltersComponent,
    ],
    imports: [
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      RouterTestingModule,
      NoopAnimationsModule,
      TranslateStubModule,
      StoreModule.forRoot({
        'mediaLibrary': combineReducers(fromMediaLibrary.reducers),
        'user': combineReducers(fromUser.reducers, {
          user: new FakeUserModelFactory().modelPropertiesCustom([])
        })
      }, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    providers: [
      MediaLibraryConfigProvider,
      { provide: OverlayService, useClass: OverlayServiceStub },
      { provide: DATA, useValue: MOCK_DEFAULT_OVERLAY_CONFIG },
      { provide: UserService, useClass: UserServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = TestBed.get(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addVideo triggers a modal', () => {
    const spy = spyOn(dialog, 'open');
    component.addVideo();
    expect(spy).toHaveBeenCalledTimes(1);
  });

});
