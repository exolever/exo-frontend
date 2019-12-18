import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { FakeConsultantFactory } from '@applications/shared/faker_factories';

import { MyPurposeComponent } from './my-purpose.component';

describe('MyPurposeComponent', () => {
  let component: MyPurposeComponent;
  let fixture: ComponentFixture<MyPurposeComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      TranslateStubModule
    ],
    declarations: [ MyPurposeComponent ]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPurposeComponent);
    component = fixture.componentInstance;
    component.profileUser = new FakeConsultantFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
