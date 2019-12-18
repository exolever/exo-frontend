import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PickerResponse, PickerFileMetadata } from 'filestack-js/build/main/lib/picker';

import { FilestackService, FILESTACK_SUCCESS_STATUS } from '@core/services/filestack.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resource-uploader',
  templateUrl: './resource-uploader.component.html',
  styleUrls: ['./resource-uploader.component.scss']
})
export class ResourceUploaderComponent implements OnInit, OnDestroy {
  @Output() upload = new EventEmitter<PickerFileMetadata>();
  private subscription = new Subscription();
  constructor(
    private filestackService: FilestackService
  ) { }

  ngOnInit() {
    this.filestackService.init();
    this.subscription.add(this.filestackService.uploadedFiles$
    .subscribe((files: PickerResponse) => {
      files.filesUploaded.forEach((file: PickerFileMetadata) => {
        const fileToSend = {... file, status: FILESTACK_SUCCESS_STATUS};
        if (!fileToSend.mimetype) {
          fileToSend.mimetype = 'octet-stream';
        }
        this.upload.emit(fileToSend);
      });
    }));
  }

  openPicker() {
    this.filestackService.open();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
