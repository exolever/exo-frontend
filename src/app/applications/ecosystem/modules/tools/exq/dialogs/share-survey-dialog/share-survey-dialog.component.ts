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
import { Survey } from '@ecosystem/modules/tools/exq/store/exq.model';

@Component({
  templateUrl: './share-survey-dialog.component.html',
  styleUrls: ['./share-survey-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareSurveyDialogComponent implements AfterViewInit {
  @ViewChild('urlInputText', {read: ElementRef, static: false}) urlInputText: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ShareSurveyDialogComponent>,
    private chDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private copyToClipboardService: CopyToClipboardService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: Survey,
  ) {}

  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.urlInputText.nativeElement, 'value', this.getUrl());
    (<HTMLInputElement>this.urlInputText.nativeElement).setSelectionRange(
      0, this.getUrl().length
    );
    this.chDetectorRef.detectChanges();
  }

  /**
   * Restores url value and copies it to clipboard
   */
  onCopyToClipboard($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.copyToClipboardService.copyMessage(this.getUrl());
    this.snackBar.open(
      this.translate.instant('COMMON.COPIED_CLIPBOARD'),
      this.translate.instant('NOTIFICATION.CLOSE')
    );
  }

  private getUrl() {
    return `${this.data.publicUrl}?slug=${this.data.slug}&lang=${this.data.language}`;
  }
}
