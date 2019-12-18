import { Injectable } from '@angular/core';

@Injectable()
export class WindowRef {
  get nativeWindow(): any {
    return this.window();
  }

  private window(): any {
    return window;
  }
}
