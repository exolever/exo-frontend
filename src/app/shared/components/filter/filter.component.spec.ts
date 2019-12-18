import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { ExoCommonModule } from '@shared/exo-common.module';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  const moduleDef:  TestModuleMetadata = {
    imports: [
      ExoCommonModule,
      NoopAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      RouterTestingModule,
      TranslateStubModule
    ],
    declarations: [FilterComponent],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.name = 'Name displayed';
    component.nameFilter = 'name_filter';
    component.options = [
      {pk: '1', name: 'option1', showByDefault: true, selected: false},
      {pk: '2', name: 'option2', showByDefault: true, selected: false},
      {pk: '3', name: 'option3', showByDefault: false, selected: false},
      {pk: '4', name: 'option4', showByDefault: false, selected: false}
    ];
    component.allowSearch = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can add more options', () => {
    expect(component).toBeTruthy();
    const expansionPanel: DebugElement = fixture.debugElement.query(By.css('[name=add-more-box]'));
    expect(expansionPanel).toBeTruthy();
  });

  it('can NOT add more options', () => {
    expect(component).toBeTruthy();
    component.allowSearch = false;
    fixture.detectChanges();
    const expansionPanel: DebugElement = fixture.debugElement.query(By.css('[name=add-more-box]'));
    expect(expansionPanel).toBeFalsy();
  });

  it('does not has filters selected by default', () => {
    expect(component.filtersCounter).toEqual(0);
  });

  it('#hasFilters should works when click in checkboxes', () => {
    expect(component).toBeTruthy();
    const expansionPanel: DebugElement = fixture.debugElement.query(By.css('mat-panel-title'));
    expansionPanel.nativeElement.click();
    expect(expansionPanel).toBeTruthy();
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.filtersCounter).toEqual(0);
    const checkboxes: DebugElement[] = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    checkboxes.forEach(c => c.nativeElement.querySelector('label').click());
    fixture.detectChanges();
    expect(component.filtersCounter).toBeGreaterThan(0);
  });

  it('#optionChecked should works', () => {
    const expansionPanel: DebugElement = fixture.debugElement.query(By.css('mat-panel-title'));
    expansionPanel.nativeElement.click();
    component.ngOnChanges();
    expect(component.optionChecked({pk: '1', name: 'option1'})).toBeFalsy();
    fixture.detectChanges();
    const checkboxes: DebugElement[] = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    checkboxes.forEach(c => c.nativeElement.querySelector('label').click());
    fixture.detectChanges();
    expect(component.optionChecked({pk: '1', name: 'option2'})).toBeTruthy();
  });

  it('should mark the default options initially', () => {
    component.listToShow[0]['selected'] = true;
    component.ngOnChanges();
    expect((component as any).filters.length).toBe(1);
  });

  it('#hasFilters should works when click in radiobutton', () => {
    component.isRadioButton = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const expansionPanel: DebugElement = fixture.debugElement.query(By.css('mat-panel-title'));
    expansionPanel.nativeElement.click();
    expect(expansionPanel).toBeTruthy();
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.filtersCounter).toEqual(0);
    const radioButtons: DebugElement[] = fixture.debugElement.queryAll(By.css('mat-radio-button'));
    radioButtons.forEach(c => c.nativeElement.querySelector('label').click());
    fixture.detectChanges();
    expect(component.filtersCounter).toBeGreaterThan(0);
  });
});
