import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>
  ) {}

  onDownloadSummary() {
    // Tracking: (ActionGA.DownloadBook, {
    //   label: CategoryGA.Landing,
    //   category: CategoryGA.Landing
    // });

    window.open('https://exponentialtransformationbook.com/wp-content/uploads/ExO_Sprint_Summary-English.pdf',
      '_blank');
  }

}
