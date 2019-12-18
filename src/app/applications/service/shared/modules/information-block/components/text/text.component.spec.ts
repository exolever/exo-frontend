/*
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configTestBed } from '@testing/test.common.spec';
import { TextComponent } from './text.component';
import { InformationBlock, InformationBlockType, InformationBlockI } from '@services/modules/information-block/models';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  const moduleDef: TestModuleMetadata = {
    declarations: [
      TextComponent
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    component.textBlock = new InformationBlock(<InformationBlockI>{
      pk: '1',
      title: 'Test',
      order: 2,
      type: InformationBlockType.Text,
      contents: ['Some random text for testing purpose']
    });
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should has a div with innerHTML attribute', () => {
    const de = fixture.debugElement.query(By.css('div'));
    expect(de.nativeElement).toBeTruthy();
    expect(de.properties.innerHTML).toEqual('Some random text for testing purpose');
  });
});
*/
