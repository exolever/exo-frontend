import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {
  readonly SIZE_LIMIT = 2621440; // 2,5 MB
  @ViewChild('cropper', {static: false}) cropper: ImageCropperComponent;
  settings: CropperSettings;
  maxSizeExceeded: boolean;

  constructor(
    public dialogRef: MatDialogRef<CropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.settings = new CropperSettings();
    this.settings.width = 150;
    this.settings.height = 150;
    this.settings.croppedWidth = 150;
    this.settings.croppedHeight = 150;
    this.settings.minWidth = 150;
    this.settings.minHeight = 150;
    this.settings.noFileInput = true;
    this.settings.dynamicSizing = true;
    this.settings.cropperClass = 'cropper';
    this.settings.minWithRelativeToResolution = true;
    this.settings.preserveSize = false;
  }

  ngOnInit() {
    const fileReader: FileReader = new FileReader();
    const image: any = new Image();
    fileReader.onload = (loadEvent: any) => {
      if (loadEvent.loaded < this.SIZE_LIMIT) {
        image.src = loadEvent.target.result; // <--- data: base64
        image.onload = () => {
          this.cropper.setImage(image);
        };
      } else {
        this.maxSizeExceeded = true;
      }
    };
    fileReader.readAsDataURL(this.data);
  }

}
