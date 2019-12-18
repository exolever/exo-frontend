import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import {Participant} from '../../../store/event.model';
import { FormAttendeeComponent } from './form-attendee/form-attendee.component';
import { FormImportAttendeeComponent } from './form-import/form-import.component';
import * as fromEvents from '../../../store/events.reducer';
import * as eventActions from '../../../store/events.action';
import {BreadCrumbService} from '@applications/breadcrumb/service/breadcrumb.service';

@Component({
  selector: 'app-atendees-profile',
  templateUrl: './atendees-profile.component.html',
  styleUrls: ['./atendees-profile.component.scss']
})
export class AtendeesProfileComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'actions'];
  dataSource$: Observable<Participant[]>;
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private dialog: MatDialog,
    private promptDialogService: PromptDialogService,
    private breadCrumbService: BreadCrumbService,
  ) {}

  ngOnInit() {
    this.dataSource$ = this.store.pipe(select(fromEvents.getParticipants));
    this.breadCrumbService.updateBreadCrumb({
      label: this.translate.instant('ECOSYSTEM.BREADCRUMBS.EVENTS.PARTICIPANTS')
    });
  }

  delete(attendee: Participant) {
    this.subscriptions.add(
      this.promptDialogService
        .open({
          title: this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.DELETE_TITLE'),
          messages: [this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.DELETE_MESSAGE')],
          secondaryButton: this.translate.instant('COMMON.CANCEL'),
          primaryButton: this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.DELETE')
        }).pipe(filter(value => value === true))
        .subscribe(() => this.store.dispatch(new eventActions.DeleteParticipant(attendee)))
    );
  }

  sendCertification(attendee: Participant) {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.CERTIFICATE_TITLE'),
        secondaryButton: this.translate.instant('COMMON.CANCEL'),
        primaryButton: this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.SEND')
      }).pipe(filter(value => value === true))
        .subscribe(() => this.store.dispatch(new eventActions.SendOneCertificate(attendee)))
    );
  }

  sendCertifications() {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.CERTIFICATES_TITLE'),
        secondaryButton: this.translate.instant('COMMON.CANCEL'),
        primaryButton: this.translate.instant('ECOSYSTEM.WORKSHOPS.PROMPT.SEND')
      }).pipe(filter(value => value === true))
        .subscribe(() => this.store.dispatch(new eventActions.SendCertificates()))
    );
  }

  openForm(attendee?: Participant) {
    this.store.dispatch(
      new eventActions.SelectParticipant(attendee ? attendee.id : undefined)
    );
    this.dialog.open(FormAttendeeComponent);
  }

  openImportForm() {
    this.dialog.open(FormImportAttendeeComponent);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
