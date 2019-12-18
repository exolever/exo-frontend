import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { AppState } from '@core/store/reducers';
import { configTestBed } from '@testing/test.common.spec';
import { UserService } from '@core/services';
import { UserServiceStub } from '@core/services/stubs';

import { OverlayMediaComponent } from '../overlay-media/components/overlay-media.component';
import { OverlayMediaService } from '../overlay-media/services/overlay-media.service';
import * as fromMediaLibrary from '../../store/reducers';
import * as CrudActions from '../../store/crud/crud.actions';
import { Resource, ResourceStatus, ResourceType } from '../../store/resource.model';
import { MediaLibraryWebsocketService } from '../../store/real-time.service';
import { MediaLibraryWebsocketServiceStub } from '../../store/real-time.service.stub';
import { SearchEffects } from '../../store/search/search.effect';
import { ResourcesService } from '../../services/resources.service';
import { ResourcesServiceStub } from '../../services/resources.service.stub';
import { FilterOptionsService } from '../../services/filter.service';
import { FilterOptionsServiceStub } from '../../services/filter.service.stub';
import { ResourceCardComponent } from './resource-card.component';

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;
  let store: Store<AppState>;
  const overlay = {
    open() {}
  };
  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      NoopAnimationsModule,
      TranslateStubModule,
      EffectsModule.forRoot([SearchEffects]),
      StoreModule.forRoot({'mediaLibrary': combineReducers(fromMediaLibrary.reducers)}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    declarations: [
      ResourceCardComponent,
      OverlayMediaComponent,
    ],
    providers: [
      { provide: ResourcesService, useClass: ResourcesServiceStub },
      { provide: OverlayMediaService, useValue: overlay },
      { provide: FilterOptionsService, useClass: FilterOptionsServiceStub },
      { provide: MediaLibraryWebsocketService, useClass: MediaLibraryWebsocketServiceStub },
      { provide: UserService, useClass: UserServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;
    component.resource = new Resource(
      { name: 'name', pk: '1', type: ResourceType.Video, status: ResourceStatus.Available, tags: [] }
      );
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the videos and allow to play them', () => {
    spyOn(component, 'onShow').and.returnValue(undefined);

    const videos: DebugElement[] = fixture.debugElement.queryAll(By.css('div.video-card'));
    expect(videos.length).toBe(1);

    videos[0].nativeElement.getElementsByClassName('play-button')[0].click();
    expect(component.onShow).toHaveBeenCalledTimes(1);
  });

  it('onDelete() works', () => {
    component.onDelete();
    expect(store.dispatch).toHaveBeenCalledWith(new CrudActions.Delete(component.resource));
  });

});
