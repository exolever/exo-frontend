import { FakeModel } from '@shared/faker_factories';

import { UserResponseFakeModel } from '../faker_factories/user-response-fake.model';
import { segmentUserEnum } from '../enums';
import { UserModel } from '../models/user/user.model';
import { UserReducedModel } from '../models/user/user.reduced.model';
import { UserReducedResponseFakeModel } from '@core/faker_factories/user-reduced-response-fake.model';

/**
 * Factory for the fake users (reduced model), receives a fake response and UserReducedModel
 */
export class FakeUserReducedModelFactory extends FakeModel(UserReducedModel) {
  constructor() {
    super(new UserReducedResponseFakeModel());
  }
}

/**
 * Factory for the fake users, receives a fake response and UserModel is responsible for data assignation
 */
export class FakeUserModelFactory extends FakeModel (UserModel) {
  constructor() {
    super(new UserResponseFakeModel());
  }
}

/**
 * We should instantiate this class the the fake user we are creating is supposed to be a superuser
 */
export class FakeSuperUserModelFactory extends FakeUserModelFactory {
  constructor() {
    super();
    this.isSuperuser = true;
    this.segment = segmentUserEnum.Staff;
  }
}
