/*
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { configTestBed } from '@testing/test.common.spec';
import {
  InformationBlockType,
  AdviceModel
} from '@service/modules/information-block/models';
import { AdvicesBlockComponent } from './advices-block.component';
import { TranslateStubModule } from '@testing/translate-stub.module';
import {By} from '@angular/platform-browser';

describe('AdvicesBlockComponent', () => {

  let component: AdvicesBlockComponent;
  let fixture: ComponentFixture<AdvicesBlockComponent>;

  const advices: any = {
    pk: '5',
    title: 'Advices for the week',
    order: 5,
    type: InformationBlockType.Advice,
    contents: [
      <AdviceModel>{
        pk: '1',
        order: 1,
        description: 'This is the first advice for this assignment'
      },
      <AdviceModel>{
        pk: '2',
        order: 2,
        description: 'This is another advice very important for doing correctly this assignment'
      },
      <AdviceModel>{
        pk: '3',
        order: 3,
        description: 'This is the third of advices that you should have in mind to make all the tasks in an...'
      },
      <AdviceModel>{
        pk: '4',
        order: 4,
        description: 'And this is the last, but not less important, advice for these tasks'
      }
    ]
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    declarations: [
      AdvicesBlockComponent
    ],
    providers: [
      { provide: TranslateService, useClass: TranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvicesBlockComponent);
    component = fixture.componentInstance;
    component.advicesBlock = advices;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should has a h2 with a title', () => {
    const de = fixture.debugElement.query(By.css('h2'));
    expect(de.nativeElement).toBeTruthy();
  });

});
*/
