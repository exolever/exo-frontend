import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Acl } from '@shared/models';
import { UserModel } from '@core/models/user/user.model';

import { UserService } from '../user/user.service';

@Injectable()
export class AclService implements CanActivate {
  public user: UserModel;
  private accessList: Acl;

  constructor( public login: UserService ) {
    this.login.user$.subscribe( user => this.user = user );
  }

  canActivate( route ) {
    if ( this.user.isAuthenticated() ) {
      const isSuperUser = this.user.isSuperuser;
      const userPermissions = this.user.userPermissions;
      const componentAcl = route.component;
      const funcionAcl = new componentAcl( route );
      this.accessList = funcionAcl.accessList;
      const componentPermissions = this.accessList ? this.accessList.componentPermissions : [];
      const lacksSomePermission = componentPermissions.find( permission => !userPermissions.includes( permission ));

      if ( isSuperUser || !lacksSomePermission ) {
        return true;
      }
    }
    return false;
  }
}
