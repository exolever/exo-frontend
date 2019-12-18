import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Urls } from '@core/services/navigate';
import { CircleDeserializerService } from '@applications/circles/services/circle-deserializer.service';

export enum Error403EntityEnum {
  CIRCLE = 'Circle'
}

@Injectable({
  providedIn: 'root'
})
export class Error403Service {

  constructor(
    private router: Router,
    private circleDeserializerService: CircleDeserializerService
  ) { }

  navigate(error: any): void {
    const classname = error.error ? error.error.classname : undefined;
    switch (classname) {
      case Error403EntityEnum.CIRCLE:
        const navigationExtras: NavigationExtras = {
          skipLocationChange: true,
          state: {
            url: this.router.url,
            isPost: this.isPost(),
            circle: this.circleDeserializerService.deserialize(error.error)
          }
        };
        this.router.navigate([Urls.ECOSYSTEM_CIRCLES_ACCESS], navigationExtras);
    }
  }

  /**
   * Dertemine if the error is caused by a post or a cicle
   */
  private isPost(): boolean {
    const urlTree = this.router.parseUrl(this.router.url);
    return urlTree.root.children.primary.segments.length > 3;
  }
}
