import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { PipeModule } from '@shared/pipes/pipes.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { QuestionsManagementComponent } from './questions-management.component';

describe('QuestionsManagementComponent', () => {
  let component: QuestionsManagementComponent;
  let fixture: ComponentFixture<QuestionsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateStubModule,
        ReactiveFormsModule,
        SharedModule,
        PipeModule
      ],
      declarations: [ QuestionsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsManagementComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize questionsField properly', () => {
    component.questions = [{id: 9, title: 'Question 1'}, {id: 10, title: 'Question 2'}];
    component.form = new FormGroup({});
    component.initializeQuestionsFields();
    expect(component.form.get('questions').value).toEqual(['Question 1', 'Question 2', '']);
  });
});
