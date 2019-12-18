import {
  AdviceItemComponent
} from '@applications/service/shared/modules/information-block/components/advices/advice-item/advice-item.component';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { configTestBed } from '@testing/test.common.spec';
import { By } from '@angular/platform-browser';

describe('AdviceItemComponent', () => {
  let component: AdviceItemComponent;
  let fixture: ComponentFixture<AdviceItemComponent>;

  const moduleDef: TestModuleMetadata = {
    declarations: [
      AdviceItemComponent
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceItemComponent);
    component = fixture.componentInstance;
    component.advice = {
      pk: '1',
      order: 1,
      description: 'Testing - This is the first advice for this assignments'
    };
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should has a "icon" block', () => {
    const de = fixture.debugElement.query(By.css('.advice-icon'));
    expect(de.nativeElement).toBeTruthy();
    expect(de.nativeElement.textContent).toContain('1');
  });

  it('Should has a description', () => {
    const de = fixture.debugElement.query(By.css('.advice-description'));
    expect(de.nativeElement).toBeTruthy();
    expect(de.nativeElement.className).toContain('body-1');
    expect(de.nativeElement.textContent).toContain('Testing - This is the first advice for this assignments');
  });
});
