import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { getResourceIconAndColor } from '../resource-icon-color-helper';
import { MIMES_LINK } from '@shared/components/upload-resources/mime-types';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';

@Component({
  selector: 'app-display-attached',
  templateUrl: './display-attached.component.html',
  styleUrls: ['../upload-resources-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayAttachedComponent {
  @Input() resources: FilestackUploadInterface[];

  /**
   * selects the right color and icon depending on mimetype
   * @param {string} mimetype
   * @returns {{color, icon}}
   */
  getAttachedResourceIconAndColor(mimetype: string): { color: string, icon: string } {
    return getResourceIconAndColor(mimetype);
  }

  /**
   * reads the mimetype and returns true if it is a resource of type link
   * @returns {boolean}
   */
  isLinkToExternal(mimetype: string): boolean {
    return MIMES_LINK.mimetypes.includes(mimetype);
  }

}
