import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@shared/shared.module';
import { FakeUserModelFactory } from '@core/faker_factories';
import { UrlService } from '@app/core';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import { RouterStub, Router } from '@testing/stubs/router-stubs';

import { FakePostFactory } from '../../interfaces/postFake.model';
import { FeedItemComponent } from './feed-item.component';

describe('FeedComponent', () => {
  let component: FeedItemComponent;
  let fixture: ComponentFixture<FeedItemComponent>;
  let urlService: UrlService;
  let routerService: Router;

  const moduleDef: TestModuleMetadata = {
    imports: [
      RouterTestingModule,
      TranslateStubModule,
      BrowserAnimationsModule,
      SharedModule
    ],
    declarations: [
      FeedItemComponent
    ],
    providers: [
      { provide: Router, useClass: RouterStub },
      { provide: UrlService, useValue: {getPath() { return ''; }}},
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedItemComponent);
    urlService = TestBed.get(UrlService);
    routerService = TestBed.get(Router);
    component = fixture.componentInstance;
    component.post = new FakePostFactory().modelPropertiesCustom();
    component.user = new FakeUserModelFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('editEmit() should emit "edit" event', () => {
    spyOn(component.edit, 'emit');
    component.editEmit({});
    fixture.detectChanges();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('hasNewAnswers() should return false when is unknown', () => {
    component.post.answersUnseen = undefined;
    expect(component.hasNewAnswers()).toBeFalsy();
  });

  it('hasNewAnswers() should return false when is 0', () => {
    component.post.answersUnseen = 0;
    expect(component.hasNewAnswers()).toBeFalsy();
  });

  it('stopPropagation() should stop the event bubble', () => {
    const event = new Event('click');
    const spy1 = spyOn(event, 'stopPropagation');
    const spy2 = spyOn(event, 'preventDefault');
    component.stopPropagation(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('hasNewAnswers() should return true when > 0', () => {
    component.post.answersUnseen = 1;
    expect(component.hasNewAnswers()).toBeTruthy();
  });

  it('goToProfile() should navigate to the user profile', () => {
    const event = new Event('click');
    const spyUrlService = spyOn(urlService, 'getPath');
    const spyRouter = spyOn(routerService, 'navigate');
    const spyComponent = spyOn(component, 'stopPropagation');
    component.goToProfile(event);
    expect(spyUrlService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalled();
    expect(spyComponent).toHaveBeenCalled();
  });
});
