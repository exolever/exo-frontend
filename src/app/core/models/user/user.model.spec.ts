import { UserModel } from '@core/models/user/user.model';
import { UserResponseFakeModel } from '../../faker_factories/user-response-fake.model';

describe('UserModel', () => {
  let user: UserModel;

  beforeAll(() => {
    user = new UserModel( new UserResponseFakeModel() );
  });

  it('should create', () => {
    expect( user ).toBeTruthy();
  });

  it('should populate user', () => {
    Object.keys( user ).forEach( key => {
      expect( user[ key ] ).toBeDefined();
    });
  });

  it('should add user to waiting list', () => {
    const res = new UserResponseFakeModel();
    res.groups = [{ name: 'waiting_list' }];
    user = new UserModel(res);

    expect( user.waitingList ).toBeTruthy();
  });

});
