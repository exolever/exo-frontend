export interface IPermission {
  permissions: Array<string>;
}

export class PermissionMixin implements IPermission {
  permissions: Array<string> = [];

  addPermission(permission: string): void {
    // Add a new permission to this object
    const index = this.permissions.indexOf(permission, 0);
    // avoiding duplicated permissions
    if (index === -1) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: string): void {
    // Remove a permission from this object
    const index = this.permissions.indexOf(permission, 0);
    if (index > -1) {
      this.permissions.splice(index, 1);
    }
  }

  setPermissions(permissions: Array<string>): void {
    this.permissions = this.permissions.concat(permissions);
  }

  cleanPermissions(): void {
    this.permissions = [];
  }
}
