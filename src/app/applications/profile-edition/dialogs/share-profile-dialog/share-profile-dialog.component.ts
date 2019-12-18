import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject, Renderer2,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { CopyToClipboardService } from '@profile/services/copy-to-clipboard.service';

@Component({
  selector: 'app-share-profile-dialog',
  templateUrl: './share-profile-dialog.component.html',
  styleUrls: ['./share-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareProfileDialogComponent implements AfterViewInit {
  @ViewChild('urlInputText', {static: false, read: ElementRef}) urlInputText: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ShareProfileDialogComponent>,
    private chDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private copyToClipboardService: CopyToClipboardService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: { url: string },
  ) {}

  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.urlInputText.nativeElement, 'value', this.data.url);
    (<HTMLInputElement>this.urlInputText.nativeElement).setSelectionRange(
      0, this.data.url.length
    );
    this.chDetectorRef.detectChanges();
  }

  /**
   * Restores url value and copies it to clipboard
   */
  onCopyToClipboard($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.copyToClipboardService.copyMessage(this.data.url);
    this.snackBar.open(
      this.translate.instant('COMMON.COPIED_CLIPBOARD'),
      this.translate.instant('NOTIFICATION.CLOSE')
    );
  }

}
