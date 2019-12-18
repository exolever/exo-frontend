import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';

import { LevelEnum } from '../enums/message-level.enum';
import { PersistentMessageModel } from '../models/persistent-message.model';
import {PersistentMessageCodeEnum} from '../enums';


export class FakePersistentMessageFactory extends FakeModel ( PersistentMessageModel ) {
  variables: any;
  canBeClosed = false;

  constructor (
    pk = faker.random.number().toString(),
    level = LevelEnum.SUCCESS,
    code = <any>PersistentMessageCodeEnum.P
  ) { super( pk, level, code ); }

  ModelPersistentMessageCustom(params: any): FakePersistentMessageFactory {
    params.map((n) => this[n.name] = n.data);
    return this;
  }
}
