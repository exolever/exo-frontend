import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { ListResourcesComponent } from './list-resources.component';
import { ResourcesService } from '../../shared/services';

describe('ListResourcesComponent', () => {
  let component: ListResourcesComponent;
  let fixture: ComponentFixture<ListResourcesComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    declarations: [ListResourcesComponent],
    providers: [
      { provide: ResourcesService, useValue: {} }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent( ListResourcesComponent );
    component = fixture.componentInstance;
    spyOn( component, 'addEllipsableClassToLastElementOfLine').and.returnValue( null );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
