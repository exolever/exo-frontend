import {Component, Input, OnDestroy} from '@angular/core';
import {Event} from '@ecosystem/modules/events/store/event.model';
import {filter, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {AppState} from '@core/store/reducers';
import {ActivatedRoute, Router} from '@angular/router';
import * as eventActions from '@ecosystem/modules/events/store/events.action';
import {Subscription} from 'rxjs';
import {PromptDialogService} from '@shared/modules/prompt-dialog/prompt-dialog.service';
import * as MomentTZ from 'moment-timezone';

@Component({
  selector: 'app-events-card',
  templateUrl: './events-card.component.html',
  styleUrls: ['./events-card.component.scss']
})
export class EventsCardComponent implements OnDestroy {
  @Input() event: Event;
  private subscriptions = new Subscription;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private promptDialogService: PromptDialogService
  ) {
  }

  goToEdit() {
    this.store.dispatch(new eventActions.SetCurrentEvent(this.event.uuid));
    this.router.navigate(['details/' + this.event.uuid], {relativeTo: this.route});
  }

  onDeleteEvent() {
    this.subscriptions.add(
      this.promptDialogService.open({
        title: this.translate.instant('ECOSYSTEM.EVENTS.DIALOG.DELETE.TITLE'),
        messages: [
          this.translate.instant('ECOSYSTEM.EVENTS.DIALOG.DELETE.MESSAGE'),
        ],
        secondaryButton: this.translate.instant('ECOSYSTEM.EVENTS.PROMPT.CANCEL'),
        primaryButton: this.translate.instant('ECOSYSTEM.EVENTS.PROMPT.YES')
      }).pipe(
        filter(result => result === true),
        tap(() => {
          const action = new eventActions.DeleteEvent({uuid: this.event.uuid});
          this.store.dispatch(action);
        })
      ).subscribe());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  stopPropagation($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  isUpDate() {
    return  MomentTZ().isBefore(this.event.end, 'day') ||
      MomentTZ().isSame(this.event.end, 'day');
  }
}
