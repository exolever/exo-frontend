import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { OnboardingStepComponent } from './onboarding-step.component';

describe('OnboardingStepComponent', () => {
  let component: OnboardingStepComponent;
  let fixture: ComponentFixture<OnboardingStepComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      TranslateStubModule
    ],
    declarations: [OnboardingStepComponent]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingStepComponent);
    component = fixture.componentInstance;
    component.order = 1;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event with previous method', () => {
    const spy = spyOn(component.goTo, 'emit');
    component.previous();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ step: 0, isLast: false });
  });

  it('should emit event with next method', () => {
    const spy = spyOn(component.goTo, 'emit');
    component.next();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ step: 2, isLast: false });
  });

  it('should be shown with show method', () => {
    component.show();
    expect(component.isActive()).toBeTruthy();
  });

  it('should be hidden with hide method', () => {
    component.hide();
    expect(component.isActive()).toBeFalsy();
  });

});
