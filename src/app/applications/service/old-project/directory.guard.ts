import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { map } from 'rxjs/operators';

import { ProjectService } from './services/project.service';

@Injectable()
export class DirectoryGuard implements CanActivate {

  constructor(
    private projectService: ProjectService
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const pk = route.params['pk'] ? route.params['pk'] : route.params['pkService'];
    return this.projectService.getProjectResolver(pk)
      .pipe(
        map((project) => !!project.directoryEnabled)
      );
  }
}
