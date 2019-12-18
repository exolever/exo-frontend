import { ComponentFixture, TestBed, fakeAsync, TestModuleMetadata } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { AppState } from '@core/store/reducers';
import { KeywordModel } from '@applications/shared/models';
import { configTestBed } from '@testing/test.common.spec';

import { ResourcesService } from '../../services/resources.service';
import { ResourcesServiceStub } from '../../services/resources.service.stub';
import { FilterOptionsService } from '../../services/filter.service';
import { FilterOptionsServiceStub } from '../../services/filter.service.stub';
import * as fromMediaLibrary from '../../store/reducers';
import * as CrudActions from '../../store/crud/crud.actions';
import { ResourceFormComponent } from './resource-form.component';

const dialogStub = {
  close() {}
};

describe('ResourceFormComponent from Ecosystem', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;
  let store: Store<AppState>;

  const moduleDef: TestModuleMetadata = {
    declarations: [
      ResourceFormComponent
    ],
    imports: [
      SharedModule,
      BrowserAnimationsModule,
      TranslateStubModule,
      ReactiveFormsModule,
      StoreModule.forRoot({'mediaLibrary': combineReducers(fromMediaLibrary.reducers)}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    providers: [
      { provide: MatDialogRef, useValue: dialogStub },
      { provide: MAT_DIALOG_DATA, useValue: {}},
      { provide: ResourcesService, useClass: ResourcesServiceStub },
      { provide: FilterOptionsService, useClass: FilterOptionsServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    component.data = undefined;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a empty form when it doesn\'t have data', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.get('origin').value).toBeFalsy();
    expect(component.form.get('url').value).toBeFalsy();
    expect(component.form.get('name').value).toBeFalsy();
    expect(component.form.get('tags').value).toEqual([]);
    component.projectType.controls.forEach( control => {
      expect(control.value).toEqual(false);
    });
    component.hubs.controls.forEach( control => {
      expect(control.value).toEqual(false);
    });
  }));

  it('should create a filled form when it has data', fakeAsync(() => {
    const tag = new KeywordModel('tag1');
    tag.setPk('1');

    component.data = {
      pk: '1',
      link: 'http://example.com',
      name: 'my name',
      description: 'my description',
      tags: [tag]
    };

    component.ngOnInit();

    expect(component.form.get('url').value).toBe(component.data.link);
    expect(component.form.get('name').value).toBe(component.data.name);
    expect(component.form.get('description').value).toBe(component.data.description);
    expect(component.form.get('tags').value).toEqual([tag]);
  }));

  it('should dispatch the right action when you submit a new resource', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    const tag = new KeywordModel('tag');
    tag.setPk('1');

    component.form.get('origin').setValue('Own');
    component.form.get('url').setValue('http://example');
    component.form.get('name').setValue('my name');
    component.form.get('tags').setValue([tag]);
    component.form.get('description').setValue('Example description');

    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(new CrudActions.Upload({
      name: 'my name',
      url: 'http://example',
      description: 'Example description',
      tags: [ '1' ],
      sections: []
    }));
  }));

  it('should dispatch the right action when you submit a existing resource', fakeAsync(() => {
    component.data = {
      pk: '1',
      link: 'http://example.com',
      name: 'my name',
      description: 'my description',
      tags: [new KeywordModel('tag1')]
    };
    component.ngOnInit();
    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith( new CrudActions.Update({
      name: 'my name',
      url: 'http://example.com',
      description: 'my description',
      tags: [ undefined ],
      pk: '1',
      sections: []
    }));
  }));

});
