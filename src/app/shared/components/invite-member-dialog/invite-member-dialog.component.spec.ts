import { MatDividerModule } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { UrlService } from '@app/core';
import { UrlServiceStub } from '@core/services/stubs';
import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';

import { InviteModalComponent } from './invite-member-dialog.component';
import { configTestBed } from '@testing/test.common.spec';
import { environment } from '@environments/environment';

describe('InviteModalComponent', () => {
  let component: InviteModalComponent;
  let fixture: ComponentFixture<InviteModalComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
      MatDividerModule,
    ],
    declarations: [
      InviteModalComponent
    ],
    providers: [
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: OverlayService, useClass: OverlayServiceStub }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal for inviting individual', () => {
    const spy = spyOn( component, 'recommendSomeone' );
    const buttonInviteInd = fixture.debugElement.query(By.css('button'));
    expect( buttonInviteInd ).toBeDefined();

    buttonInviteInd.nativeElement.click();
    expect( spy ).toHaveBeenCalledWith( environment.TF_RECOMMEND_IND_URL );
  });
});
