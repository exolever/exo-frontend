import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';

import { ExoCommonModule } from '../../exo-common.module';
import { getValueEnum } from '../../helpers/enum.helper';
import { AlertComponent } from './alert.component';
import { typeAlertEnum } from './alert.model';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  const moduleDef: TestModuleMetadata = {
    declarations: [AlertComponent],
    imports: [ExoCommonModule]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
  });

  it('should create', () => {
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be primary from custom color', () => {
    component = fixture.componentInstance;
    component.color = 'primary';
    fixture.detectChanges();
    expect(component.styleAlert.color).toEqual('primary');
  });
  it('should be primary from custom icon', () => {
    component = fixture.componentInstance;
    component.icon = 'notifications';
    fixture.detectChanges();
    expect(component.styleAlert.icon).toEqual('notifications');
  });
  it('should be primary from style', () => {
    component = fixture.componentInstance;
    component.typeAlert = getValueEnum(typeAlertEnum, typeAlertEnum.information);
    fixture.detectChanges();
    expect(component.styleAlert.color).toEqual('primary');
  });
  it('should be error from style', () => {
    component = fixture.componentInstance;
    component.typeAlert = getValueEnum(typeAlertEnum, typeAlertEnum.error);
    fixture.detectChanges();
    expect(component.styleAlert.color).toEqual('error');
  });

  it('should to parse the message', () => {
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.color = 'accent';
    let message = 'testing with %message% to %parse%';
    expect('testing with <label class="accent-color">message</label> to <label class="accent-color">parse</label>').
      toEqual(component.parseMessage(message));

    message = 'testing with message to parse';
    expect('testing with message to parse').toEqual(component.parseMessage(message), 'message without changes');

    message = '';
    expect('').toEqual(component.parseMessage(message), 'Empty message');
  });
});
