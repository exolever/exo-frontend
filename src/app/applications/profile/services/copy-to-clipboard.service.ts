import { Injectable } from '@angular/core';

import { WindowRef } from '@app/core';

@Injectable()
export class CopyToClipboardService {

  constructor(private w: WindowRef) { }

  /**
   * method to copy into clipboard
   * @param copy
   */
  copyMessage(copy: string) {
    const selBox = this.w.nativeWindow.document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = copy;
    this.w.nativeWindow.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.w.nativeWindow.document.execCommand('copy');
    this.w.nativeWindow.document.body.removeChild(selBox);
  }

}
