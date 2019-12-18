import { async, ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import * as faker from 'faker';
import { StoreModule, combineReducers } from '@ngrx/store';

import { of as observableOf } from 'rxjs';

import * as fromUser from '@core/store/user/user.reducer';
import { FakeUserModelFactory } from '@core/faker_factories';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

import { FakePersistentMessageFactory } from './faker_factories/persistentMessageFake.model';
import { PersistentMessageCodeEnum, PersistentMessageActionEnum } from './enums';
import { PersistentMessageModel } from './models/persistent-message.model';
import { MessageComponent } from './messages.component';
import { MessageService } from './messages.service';

class StubMessageService {
  sendAction() {
    return observableOf(true);
  }
  getMessages() {
    return observableOf([new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    )]);
  }
  getMessagesList$() {
    return observableOf(true);
  }
}

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let translateService: TranslateService;
  let messageElement: DebugElement;

  const moduleDef: TestModuleMetadata = {
    imports: [
      MatSnackBarModule,
      NoopAnimationsModule,
      TranslateStubModule,
      RouterTestingModule,
      StoreModule.forRoot({
        'user': combineReducers(fromUser.reducers, {
          user: new FakeUserModelFactory().modelPropertiesCustom([])
        })
      }, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    declarations: [MessageComponent],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      { provide: MessageService, useClass: StubMessageService },
      TranslateService,
      MatSnackBar
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    translateService = TestBed.get(TranslateService);

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cover all possible error messages described in the codes enum', async() => {
    const totalEnumCodes = Object.keys( PersistentMessageCodeEnum ).length;
    const persistentMessageList = [];
    let displayedMessages: number;

    Object.keys ( PersistentMessageCodeEnum ).forEach( code => {
      // set the property so that in each iteration we have a code of the possible database error responses
      persistentMessageList.push (
        new FakePersistentMessageFactory(
          faker.random.number().toString(),
          40,
          code.toString()
        )
      );
    });

    component.userPersistentMessagesList = persistentMessageList;
    fixture.detectChanges();
    displayedMessages = fixture.debugElement.queryAll( By.css( '.message-item' ) ).length;

    expect( displayedMessages ).toEqual( totalEnumCodes );
  });

  it('should close the persistent ', () => {
    const persistentMessage = new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    );

    // cannot be closed set up
    persistentMessage.ModelPersistentMessageCustom([{
      name: 'canBeClosed',
      data: false
    }]);

    component.userPersistentMessagesList = [ persistentMessage ];
    fixture.detectChanges();

    const notExistCloseIcon = fixture.debugElement.query(By.css('.close-message'));
    expect( notExistCloseIcon ).toBeNull();

    // can be closed set up
    persistentMessage.ModelPersistentMessageCustom([{
      name: 'canBeClosed',
      data: true
    }]);

    component.userPersistentMessagesList = [ persistentMessage ];
    fixture.detectChanges();

    const existCloseIcon = fixture.debugElement.query(By.css('.close-message'));
    expect( existCloseIcon ).not.toBeNull();
  });

  it('should send actions', () => {
    const msg = new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    );
    component.userPersistentMessagesList = [];
    component.sendAction(PersistentMessageActionEnum.CLOSE_PERSISTENT_MESSAGE, msg, true);
    fixture.detectChanges();
    expect(component.userPersistentMessagesList.length).toEqual(0);

    component.userPersistentMessagesList = [new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    )];
    component.sendAction(PersistentMessageActionEnum.DISCARD_PENDING_EMAIL, msg, true, 'message');
    fixture.detectChanges();
    expect(component.userPersistentMessagesList.length).toEqual(0);

    component.userPersistentMessagesList = [new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    )];
    component.sendAction(
      PersistentMessageActionEnum.RESEND_VERIFICATION_EMAIL, msg, false, 'msg'
    );
    fixture.detectChanges();
    const nSnackbar = document.getElementsByClassName('mat-simple-snackbar').length;
    expect(document.getElementsByClassName('mat-simple-snackbar')[nSnackbar - 1].textContent).toContain(
      translateService.instant('NOTIFICATION.CLOSE')
    );
    expect(component.userPersistentMessagesList.length).toEqual(1);
  });

  it('should need refresh message', () => {
    component.userPersistentMessagesList = [new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    )];
    const messageList2 = [
      new FakePersistentMessageFactory(
        '1', 40, PersistentMessageCodeEnum.P
      ),
      new FakePersistentMessageFactory(
        '2', 40, PersistentMessageCodeEnum.P
      )
    ];
    expect(component.needRefreshMessages(messageList2)).toBeTruthy();
    const messageList3 = [new FakePersistentMessageFactory(
      '2', 40, PersistentMessageCodeEnum.P
    )];
    expect(component.needRefreshMessages(messageList3)).toBeTruthy();
    const messageList4 = [new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    )];
    expect(component.needRefreshMessages(messageList4)).toBeFalsy();
  });

  it('should print code W message', async( () => {
    const errString =
      translateService.instant('MESSAGES.PENDING_PASS') + '. ' +
      translateService.instant('MESSAGES.GO_TO_SETTINGS') + ' ' +
      translateService.instant('MESSAGES.CHANGE_PASS');

    // set a message with code W and refresh the view to display it in the DOM
    component.userPersistentMessagesList = [ new PersistentMessageModel('1', 40, 'W') ];
    fixture.detectChanges();

    messageElement = fixture.debugElement.query( By.css ( '.message-item' ));
    expect( messageElement.nativeElement.innerText ).toEqual( errString );
  }));
});
