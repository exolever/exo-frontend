import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FilestackService } from '@core/services/filestack.service';
import { PickerResponse, PickerFileMetadata } from 'filestack-js/build/main/lib/picker';


@Component({
  selector: 'app-filestack-attach-button',
  templateUrl: './filestack-attach-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilestackAttachButtonComponent implements OnInit {
  @Output() uploaded: EventEmitter<PickerFileMetadata> = new EventEmitter();
  picker;

  constructor(public filestack: FilestackService) { }

  // lifecycle hooks
  ngOnInit() {
    this.filestack.init();
  }

  onClick() {
    this.picker = this.filestack.open({
      onUploadDone: (res: PickerResponse) => this.notifyUpload(res)
    });
  }

  notifyUpload(files: PickerResponse) {
    files.filesUploaded.forEach(file => file['filestack_status'] = file.status);
    files.filesUploaded.forEach(file => this.uploaded.emit(file));

    this.picker.close();
  }
}
