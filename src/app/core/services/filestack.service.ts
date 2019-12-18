import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Client } from 'filestack-js/build/main/lib/client';
import { PickerResponse } from 'filestack-js/build/main/lib/picker';
import * as filestack from 'filestack-js';

import { environment } from '@environments/environment';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';

export const FILESTACK_SUCCESS_STATUS = 'Stored';

@Injectable()
export class FilestackService {

  client: Client;
  uploadedFiles$: Subject<PickerResponse> = new Subject<PickerResponse>();
  readonly DEFAULT_CONFIG = {
    minFiles: 1,
    maxFiles: 1,
    maxSize: (100 * 1024 * 1024),
    hideModalWhenUploading: false,
    onUploadDone: uploadedFile => this.uploadedFiles$.next(uploadedFile)
  };

  /**
   * build object of the uploaded file
   * @param file
   */
  static buildUploadedObject(file: any): FilestackUploadInterface {
    if (file.originalFile) {
      return {
        filestack_status: file.status,
        filename: file.originalFile.name,
        mimetype: file.mimetype,
        url: file.url,
      };
    } else if (file.originalPath) {
      return {
        filestack_status: FILESTACK_SUCCESS_STATUS,
        filename: file.originalPath,
        mimetype: file.mimetype,
        url: file.url,
      };
    }
  }

  constructor() {}

  /**
   * run every time a new instance of service is injected
   */
  init() {
    if (!this.client) {
      this.client = filestack.init(environment.FILESTACK_API_KEY);
    }
  }

  /**
   * open the file picker
   * @param config
   */
  open(config = {}) {
    const conf = { ...this.DEFAULT_CONFIG, ...config, dropPane: {} };
    const picker = this.client.picker(conf);
    picker.open();
    return picker;
  }

}
