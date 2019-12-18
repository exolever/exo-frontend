import { getValueEnum } from '@shared/helpers/enum.helper';

import { LevelEnum } from '../enums/message-level.enum';


export abstract class MessageModel {
  constructor(public level: number) { }
  getLevel(): string | undefined {
    return this.level ? getValueEnum(LevelEnum, this.level) : undefined;
  }
}
