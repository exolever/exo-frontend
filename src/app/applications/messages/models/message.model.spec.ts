import { FakePersistentMessageFactory } from '../faker_factories/persistentMessageFake.model';
import { PersistentMessageCodeEnum } from '../enums/persistent-message-code.enum';

describe('Message model', () => {
  it('Get level for message model', () => {
    // TODO: use original class instead of fake
    const userMessage = new FakePersistentMessageFactory(
      '1', 40, PersistentMessageCodeEnum.P
    );
    expect(userMessage.getLevel()).not.toBeUndefined();

    const wrongUserMessage = new FakePersistentMessageFactory(
      '1', 9999, PersistentMessageCodeEnum.P
    );
    expect(wrongUserMessage.getLevel()).toBeUndefined();
  });
});
