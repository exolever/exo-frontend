import { of as observableOf, BehaviorSubject } from 'rxjs';

import { UserService } from '@app/core';

import { FakeUserModelFactory } from '../../faker_factories';


export class UserServiceStub {
  public user$ = new BehaviorSubject(new FakeUserModelFactory());
  getUser() { return observableOf(new FakeUserModelFactory()); }
}

export const USER_SERVICE_STUB_PROVIDER = {
  provide: UserService, useClass: UserServiceStub
};
