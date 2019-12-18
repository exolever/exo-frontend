import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import * as fromCommunication from '@applications/shared/communication/store/reducer/communication.reducer';
import { UserChatComponent } from '@applications/shared/communication/components/user-chat/user-chat.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import { OverlayReference } from '@overlay/overlay-ref';
import { DATA } from '@overlay/services/overlay.service';
import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { of } from 'rxjs';

const communicationState: fromCommunication.ConversationState = fromCommunication.initialState;

describe('UserChatComponent', () => {
  let component: UserChatComponent;
  let fixture: ComponentFixture<UserChatComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      RouterTestingModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('communication', fromCommunication.reducer, {initialState: communicationState}),
      TranslateStubModule,
    ],
    declarations: [
      UserChatComponent,
    ],
    providers: [
      { provide: OverlayReference } ,
      { provide: MailboxService, useValue: {
        userStartConversation() { return of(); }, getUserConversationUuid() { return of([]); } }
        },
      { provide: DATA, useValue: { conversation: undefined, fromProfile: false, user: { pk: '1', uuid: 'uuid'} }},
    ],
    schemas: [NO_ERRORS_SCHEMA],
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
