import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { SliderHintComponent } from './slider-hint.component';

describe('SliderHintComponent', () => {
  let component: SliderHintComponent;
  let fixture: ComponentFixture<SliderHintComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [TranslateStubModule],
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [SliderHintComponent]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
