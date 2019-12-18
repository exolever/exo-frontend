import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { PromptDataInterface } from './prompt-dialog.interface';
import { PromptDialogComponent} from './prompt-dialog.component';


@Injectable()
export class PromptDialogService {
  constructor(private dialog: MatDialog) { }

  public open(config: PromptDataInterface, disableClose = false): Observable<any> {
    let dialogRef: MatDialogRef<PromptDialogComponent>;
    dialogRef = this.dialog.open(PromptDialogComponent, { data: config, disableClose: disableClose});
    return dialogRef.afterClosed();
  }
}
