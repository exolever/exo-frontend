import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UrlService } from '@core/services/api/resolve';
import { UrlServiceStub } from '@core/services/stubs/api-service-stub';
import { configTestBed } from '@testing/test.common.spec';
import { AlertMessageResponseInterface } from '@applications/shared/interfaces/alert-message-response.interface';

import { PersistentMessageActionEnum } from './enums/persistent-message-action.enum';
import { PersistentMessageCodeEnum } from './enums/persistent-message-code.enum';
import { FakePersistentMessageFactory } from './faker_factories/persistentMessageFake.model';
import { MessageService } from './messages.service';


describe('MessageService', () => {
  let messageService: MessageService;

  const moduleDef: TestModuleMetadata = {
    imports: [HttpClientTestingModule],
    providers: [
      MessageService,
      { provide: UrlService, useClass: UrlServiceStub }
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    messageService = TestBed.get( MessageService );
  });

  it('should cover the whole list of actions', () => {
    Object.keys( PersistentMessageActionEnum ).forEach( action => {
      expect (
        messageService.sendAction (
          action,
          new FakePersistentMessageFactory ( '1', 40, PersistentMessageCodeEnum.P )
        )
      ).toBeDefined();
    });
  });

  it('should cover all possible errors listed in the enum', () => {
    // create stub message
    const elem: any = { id: '4', level: 40, code: undefined, can_be_closed: false, variables: {} };

    Object.keys( PersistentMessageCodeEnum ).forEach( code => {
      // set the code of the message to the current iteration code
      elem.code = code;
      const messages: Array<AlertMessageResponseInterface> = [ elem ];
      const messageCode = messageService.setMessages ( messages )[0].getCode();

      expect ( messageCode ).toBeDefined();
    });
  });
});
