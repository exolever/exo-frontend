import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState } from '@core/store/reducers';

import * as fromEvents from '../../../../store/events.reducer';
import * as actions from '../../../../store/events.action';
import { Event } from '../../../../store/event.model';

@Component({
  selector: 'app-form-import-attendee',
  templateUrl: './form-import.component.html',
  styleUrls: ['./form-import.component.scss']
})
export class FormImportAttendeeComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private uuid: string;
  contentParsed: string;

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<FormImportAttendeeComponent>
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.store.pipe(
        select(fromEvents.getSelectedEvent),
        filter(a => a !== undefined)
      ).subscribe((ev: Event) => this.uuid = ev.uuid)
    );
  }

  parse(files: FileList): void {
    const file: File = files.item(0);
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (): void => { this.contentParsed = <string>(reader.result); };
}

  upload() {
    this.store.dispatch(new actions.UploadParticipantsFile({uuid: this.uuid, data: this.contentParsed}));
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
