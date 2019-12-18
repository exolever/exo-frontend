import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule, MatDialogModule } from '@angular/material';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';
import { configTestBed } from '@testing/test.common.spec';

import { FileSizePipe } from '../../shared/pipes';
import { ResourcesService, DeserializeResourceService } from '../../shared/services';
import { globalResourceConfig, RESOURCES_CONFIG } from '../../resource.config.service';
import { AddResourceComponent } from '../add-resource/add-resource.component';

describe('ResourceAreaComponent', () => {
  let component: AddResourceComponent;
  let fixture: ComponentFixture<AddResourceComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
      MatSnackBarModule,
      MatDialogModule
    ],
    declarations: [
      AddResourceComponent,
      FileSizePipe
    ],
    providers: [
      FileSizePipe,
      { provide: ResourcesService, useValue: {} },
      { provide: DeserializeResourceService, useValue: {} },
      { provide: RESOURCES_CONFIG, useValue: globalResourceConfig },
      { provide: OverlayService, useClass: OverlayServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
