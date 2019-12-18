import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { FILESTACK_STUB_PROVIDER } from '@core/services/stubs';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';

import { UploadedFilesListComponent } from './uploaded-files-list.component';
import { By } from '@angular/platform-browser';

describe('UploadedFilesListComponent', () => {
  let fixture: ComponentFixture<UploadedFilesListComponent>;
  let component: UploadedFilesListComponent;
  const resource: FilestackUploadInterface =  {
    filestack_status: 'Stored',
    filename: 'http://www.google.com/',
    mimetype: 'text/html',
    url: 'https://cdn.filestackcontent.com/h5HkXJzoQV66ZsEfNeF9'
  };

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    providers: [
      FILESTACK_STUB_PROVIDER
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedFilesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a resource once uploaded', () => {
    fixture.detectChanges();
    let chipElements = fixture.debugElement.queryAll(By.css('mat-chip'));

    // there are no chips
    expect(chipElements.length).toEqual(0);

    // add one chip
    component.uploadedResources.push(resource);
    fixture.detectChanges();
    chipElements = fixture.debugElement.queryAll(By.css('mat-chip'));

    expect(chipElements.length).toEqual(1);

    // delete clicking the delete icon
    chipElements[0].nativeElement.querySelector('mat-icon:last-child').click();

    fixture.detectChanges();
    chipElements = fixture.debugElement.queryAll(By.css('mat-chip'));

    expect(chipElements.length).toEqual(0);
  });

});
