import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {select, Store} from '@ngrx/store';
import {AppState} from '@core/store/reducers';
import * as actions from '../../../../store/events.action';
import {RoleMember} from '@ecosystem/modules/events/store/event.enums';
import {filter, map} from 'rxjs/operators';
import {Participant} from '@ecosystem/modules/events/store/event.model';
import * as fromEvents from '../../../../store/events.reducer';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-form-attendee',
  templateUrl: './form-attendee.component.html',
  styleUrls: ['./form-attendee.component.scss']
})
export class FormAttendeeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<FormAttendeeComponent>
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      id: [undefined],
      role: [RoleMember.PARTICIPANT]
    });
    this.subscriptions.add(
      this.store.pipe(
        select(fromEvents.getSelectedParticipant),
        filter(a => a !== undefined),
        map((attendee: Participant) =>
          this.form.patchValue({fullName: attendee.fullName, userEmail: attendee.userEmail, id: attendee.id})
        )
      ).subscribe()
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.getRawValue();
      const action = data.id ? new actions.UpdateParticipant(data) : new actions.CreateParticipant(data);
      this.store.dispatch(action);
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
