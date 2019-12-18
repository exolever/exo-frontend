import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

@Injectable()
export class DirectoryGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot) {
    return true;
  }
}
