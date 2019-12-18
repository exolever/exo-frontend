import { PersistentMessageCodeEnum } from '../enums';
import { MessageModel } from './message.model';

export class PersistentMessageModel extends MessageModel {
  public variables = {};
  public canBeClosed = false;

  constructor(
    public pk: string,
    public level: number,
    public code: string,
  ) {
    super( level );
  }

  getCode(): string {
    return PersistentMessageCodeEnum[ this.code ];
  }

  getValueForVariable(key: string): any {
    let value;
    Object.keys(this.variables).forEach(k => {
      if (k === key) {
        value = this.variables[k];
      }
    });

    return value;
  }
}
