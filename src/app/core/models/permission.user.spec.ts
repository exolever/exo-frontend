import { FakeUserModelFactory } from '../faker_factories';
import { StaticPermissions } from '../services/acl/permissions';
import { PermissionMixin } from './permission.model';

describe('A user', () => {
  /* Example of class with permissions */
  class MyExampleClass extends PermissionMixin { }

  it('should have all perms when he/she is superuser =>', () => {
    // TODO: use UserModel class instead of Factory
    const user = new FakeUserModelFactory();
    user.modelPropertiesCustom([{
      name: 'isSuperuser', data: true
    }]);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS)).toBe(true);
    const object = new MyExampleClass();
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS, object)).toBe(true);
  });
  it('can have some perms =>', () => {
    const user = new FakeUserModelFactory();
    user.modelPropertiesCustom([{
      name: 'userPermissions', data: [StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS]
    }]);
    const object = new MyExampleClass();
    expect(user.isSuperuser).toBe(false);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS)).toBe(true);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_EDIT_CONSULTANTS)).toBe(false);
    object.addPermission(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS, object)).toBe(true);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_EDIT_CONSULTANTS, object)).toBe(false);
  });
  it('can add/remove some perms =>', () => {
    const user = new FakeUserModelFactory();
    const object = new MyExampleClass();
    object.addPermission(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS, object)).toBe(true);
    object.removePermission(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS);
    expect(user.hasPermissions(StaticPermissions.CONSULTANT_CONSULTANT_LIST_CONSULTANTS, object)).toBe(false);
  });
});
