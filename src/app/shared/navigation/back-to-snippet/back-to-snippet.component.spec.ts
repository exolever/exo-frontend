import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { configTestBed } from '@testing/test.common.spec';

import { BackToSnippetComponent } from './back-to-snippet.component';

describe('BackToSnippetComponent', () => {
  let component: BackToSnippetComponent;
  let fixture: ComponentFixture<BackToSnippetComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(BackToSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the input name and print it on screen', () => {
    const expectedString = 'whatever';
    component.priorNavigationTranslateString = expectedString;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.subheading-2'));

    expect(el.nativeElement.innerText).toEqual('BACK TO ' + expectedString.toUpperCase());
  });

});
