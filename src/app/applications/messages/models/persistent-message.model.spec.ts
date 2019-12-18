import { FakePersistentMessageFactory } from '../faker_factories/persistentMessageFake.model';
import { PersistentMessageCodeEnum } from '../enums/persistent-message-code.enum';

describe('Persistent message model', () => {
  // TODO: use native class instead of fake
  it('Get code for persistent message model', () => {
    const userMessage = new FakePersistentMessageFactory(
      '1', 40, 'P'
    );
    expect( userMessage.getCode() ).toEqual( 'PENDING_VALIDATION_EMAIL' );

    const wrongUserMessage = new FakePersistentMessageFactory(
      '1', 40, 'NON_EXISTING_CODE'
    );
    expect( wrongUserMessage.getCode() ).toBeUndefined();
  });

  it('Get value of specific variable', () => {
    const userMessage = new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    );
    userMessage.ModelPersistentMessageCustom([{
      name: 'variables',
      data: { 'email': 'example@gmail.com' }
    }]);
    expect(userMessage.getValueForVariable('email')).toEqual('example@gmail.com');
    expect(userMessage.getValueForVariable('notExist')).toBeUndefined();
  });
});
