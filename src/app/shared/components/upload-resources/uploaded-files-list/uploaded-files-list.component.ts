import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { FilestackService } from '@core/services/filestack.service';
import { getResourceIconAndColor } from '@shared/components/upload-resources/resource-icon-color-helper';

@Component({
  selector: 'app-uploaded-files-list',
  templateUrl: './uploaded-files-list.component.html',
  styleUrls: ['../upload-resources-styles.scss']
})
export class UploadedFilesListComponent implements OnInit, OnDestroy {
  @Output() onDelete = new EventEmitter();
  @Input() uploadedResources: FilestackUploadInterface[] = [];
  @Input() removable = true;
  private subscriptions: Subscription[] = [];

  constructor(
    public filestack: FilestackService
  ) { }

  // lifecycle hooks
  ngOnInit() {
    this.subscriptions.push(
      this.filestack.uploadedFiles$.subscribe(uploadResult => this.manageUploadResult(uploadResult))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Add upload to array of uploads
   */
  private manageUploadResult(uploadResult: any): void {
    if (uploadResult.filesFailed.length) {
      console.error('following files could not be sent by filestack: ' + uploadResult.filesFailed);
    }
    if (uploadResult.filesUploaded.length) {
      this.uploadedResources.push(
        ...uploadResult.filesUploaded
          .map((file: any): FilestackUploadInterface => FilestackService.buildUploadedObject(file))
      );
    }
  }

  /**
   * retrieve the proper icon to display for each mimetype
   * @param mimetype
   */
  getAttachedResourceIconAndColor(mimetype: string): { color: string, icon: string } {
    return getResourceIconAndColor(mimetype);
  }

  /**
   * remove uploaded item
   */
  removeChipItem(i: number): void {
    this.uploadedResources.splice(i, 1);
  }

  onRemove(index) {
    this.onDelete.emit(index);
  }
}
