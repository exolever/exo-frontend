import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { UrlService, UserService } from '@app/core';
import { UserServiceStub } from '@core/services/stubs';
import { SocketService } from '@applications/sockets/service/socket.service';
import { SocketServiceStub } from '@applications/sockets/service/socket.service-stub';
import { configTestBed } from '@testing/test.common.spec';
import { StoreModule } from '@ngrx/store';
import { initialState, reducer } from '@applications/shared/communication/store/reducer/communication.reducer';

describe('Communication Service', () => {
  let communicationService: CommunicationService;
  let httpTestingController: HttpTestingController;

  const moduleDef: TestModuleMetadata = {
    imports: [
      HttpClientTestingModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('communication', reducer, {initialState: initialState} ),
    ],
    providers: [
      CommunicationService,
      UrlService,
      { provide: UserService, useClass: UserServiceStub },
      { provide: SocketService, useClass: SocketServiceStub },
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    // Inject the http service and test controller for each test
    communicationService = TestBed.get(CommunicationService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('Retrieve a list of messages belonged to a conversation', () => {
    const testData = {results: [{user: '123321-123-uuid'}], prev: undefined, next: undefined};

    communicationService.getConversationMessages('0d2dbf27-8015-40e8-bf85-3cb111b68b57', '10')
      .subscribe((data) => expect(data).toEqual(testData));

    const req = httpTestingController
      .expectOne('conversations/api/0d2dbf27-8015-40e8-bf85-3cb111b68b57/conversations/10/messages/');

    expect(req.request.method).toEqual('GET');
    req.flush(testData);
    httpTestingController.verify();
  });

  it('Reply a conversation', () => {
    const sendData = { message: 'Reply a conversation', files: [{filename: 'Name of file'}] };
    const responseData = {
      message: sendData.message,
      id: 1,
      user: 'uuid-s123-sdf',
      conversation: 2,
      unread: true,
      files: sendData.files,
    };
    communicationService.replyConversation('0d2dbf27-8015-40e8-bf85-3cb111b68b57', '10', sendData)
      .subscribe((data) => expect(data).toEqual(responseData));

    const req = httpTestingController
      .expectOne('conversations/api/0d2dbf27-8015-40e8-bf85-3cb111b68b57/conversations/10/reply/');

    expect(req.request.method).toEqual('POST');
    req.flush(responseData);
    httpTestingController.verify();

  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

});
