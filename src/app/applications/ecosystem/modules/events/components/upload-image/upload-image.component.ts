import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { PickerFileMetadata, PickerResponse } from 'filestack-js';
import { Subscription } from 'rxjs';
import { FILESTACK_SUCCESS_STATUS, FilestackService } from '@core/services/filestack.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit, OnDestroy {
  @Output() upload = new EventEmitter<PickerFileMetadata>();
  file: PickerFileMetadata;
  private subscription = new Subscription();
  pickerOptions = {
    accept: 'image/*',
    transformations: {
      crop: {
        aspectRatio: 16 / 9,
        force: true
      }
    },
    fromSources: ['local_file_system', 'instagram', 'url', 'facebook', 'googledrive', 'imagesearch']
  };

  constructor(
    private filestackService: FilestackService
  ) { }

  ngOnInit() {
    this.filestackService.init();
    this.subscription.add(this.filestackService.uploadedFiles$
      .subscribe((files: PickerResponse) => {
        files.filesUploaded.forEach((file: PickerFileMetadata) => {
          const fileToSend = {... file, status: FILESTACK_SUCCESS_STATUS};
          this.file = file;
          if (!fileToSend.mimetype) {
            fileToSend.mimetype = 'octet-stream';
          }
          this.upload.emit(fileToSend);
        });
      }));
  }

  openPicker() {
    this.filestackService.open(this.pickerOptions);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDeleteResource() {
    this.file = null;
    this.upload.emit(null);
  }
}
