import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

import { CropperComponent } from '@shared/components/cropper/cropper.component';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.scss']
})
export class ProfilePicComponent {

  @Input()
  avatar: string;

  @Output()
  croppedImage: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('customInput', {static: false})
  customInput;

  private dialogRef: MatDialogRef<CropperComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  fileChangeListener($event): void {
    if ($event.target.files.length > 0) {
      const file = $event.target.files[0];
      this.dialogRef = this.dialog.open(CropperComponent, {
        disableClose: false,
        role: 'alertdialog',
        data: file
      });

      this.dialogRef.afterClosed().subscribe((image: File) => {
        if (image) {
          this.avatar = image['image'];
          this.croppedImage.emit(image);
          this.snackBar.open(
            this.translate.instant('DIALOGS.PICTURE_UPDATED'), this.translate.instant('COMMON.CLOSE')
          );
        }
        // Allow loading the same file again
        $event.target.value = null;
        this.dialogRef = null;
      });
    }
  }

  changePicture() {
    this.customInput.nativeElement.click();
  }

}
