import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { QuillModule } from 'ngx-quill';

import { SharedModule } from '@shared/shared.module';
import { FakeUserModelFactory } from '@core/faker_factories';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { FakeAnswerFactory } from './../../interfaces/answerFake.model';
import { AnswerComponent } from './answer.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { WriteCommentComponent } from '../write-comment/write-comment.component';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      RouterTestingModule,
      TranslateStubModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      SharedModule,
      QuillModule
    ],
    declarations: [
      AnswerComponent,
      StarRatingComponent,
      WriteCommentComponent
    ],
    providers: [
      FormBuilder,
      URL_SERVICE_STUB_PROVIDER,
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    component.answer = new FakeAnswerFactory().modelPropertiesCustom();
    component.user = new FakeUserModelFactory().modelPropertiesCustom();
    component.editionMode = false;
    component.canBeVoted = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('editionMode should be true when is enabled', () => {
    component.enableEditionMode();
    expect(component.editionMode).toBeTruthy();
  });

  it('editionMode should be false when is disabled', () => {
    component.disableEditionMode();
    expect(component.editionMode).toBeFalsy();
  });

  it('showMenu() should be false when the user is NOT the creator', () => {
    component.user.pk = '-1';
    expect(component.showMenu()).toBeFalsy();
  });

  it('showMenu() should be false when the user is the creator', () => {
    component.user = component.answer.createdBy;
    expect(component.showMenu()).toBeTruthy();
  });

  it('onEdited() should emit "edited" event', () => {
    spyOn(component.edit, 'emit');
    component.onEdited({});
    fixture.detectChanges();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('onVoted() should emit "rating" event', () => {
    spyOn(component.rating, 'emit');
    component.onVoted(1);
    fixture.detectChanges();
    expect(component.rating.emit).toHaveBeenCalled();
  });

  it('onVoted() should emit "rating" event', () => {
    spyOn(component.rating, 'emit');
    component.onVoted(1);
    fixture.detectChanges();
    expect(component.rating.emit).toHaveBeenCalled();
  });

});
