/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ɵMatchMedia, ɵMockMatchMedia, MediaObserver } from '@angular/flex-layout';
import { Observable, of } from 'rxjs';

/**
 * Pre-configured provider for MockMatchMedia
 */
export const MockMatchMediaProvider = {
  provide: ɵMatchMedia,
  useClass: ɵMockMatchMedia
};

/**
 * MediaObserverMock
 */
export class MediaObserverMock  {
  public media$: Observable<any> = of({});
}

export const ObservableMediaMockProvider = {
  provide: MediaObserver,
  useClass: MediaObserverMock
};
