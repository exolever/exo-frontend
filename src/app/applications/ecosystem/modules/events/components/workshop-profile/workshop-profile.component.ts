import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import {AppState} from '@core/store/reducers';
import * as fromEvents from '../../store/events.reducer';
import {TypeEventEnum} from '../../store/event.enums';
import {TranslateService} from '@ngx-translate/core';
import * as eventActions from '@ecosystem/modules/events/store/events.action';
import {
  EventFormComponent
} from '@ecosystem/modules/events/components/events-form-layout/event-form/event-form.component';
import {ActivatedRoute} from '@angular/router';
import {Event} from '@ecosystem/modules/events/store/event.model';

@Component({
  selector: 'app-workshop-profile',
  templateUrl: './workshop-profile.component.html',
  styleUrls: ['workshop-profile.component.scss']
})
export class WorkshopProfileComponent implements OnInit, OnDestroy {
  @ViewChild('formComponent', {static: false}) formComponent: EventFormComponent;
  isDirty = false;
  tabs: any[];
  uuidEvent: string;
  event$: Observable<Event>;
  public category: TypeEventEnum;
  private subscriptions = new Subscription();
  typeEvent = TypeEventEnum;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.tabs = [
      {
        label: this.translate.instant('ECOSYSTEM.EVENTS.TABS.EVENT_INFO'),
        link: 'information',
      },
      {
        label: this.translate.instant('ECOSYSTEM.EVENTS.TABS.PARTICIPANTS'),
        link: 'attendees',
      }
    ];
    this.event$ = this.store.pipe(select(state => fromEvents.getSelectedEvent(state)));
    this.route.params.subscribe(routeParams => {
      this.uuidEvent = routeParams['uuid'];
      if (this.uuidEvent) {
        this.subscriptions.add(this.store.pipe(select(state => fromEvents.getSelectedEvent(state))).subscribe(
          ev => {
            if (!ev) {
              this.store.dispatch(new eventActions.SelectEvent(this.uuidEvent));
            } else {
              this.category = ev.category;
              if (ev.category === TypeEventEnum.WORKSHOP) {
                this.store.dispatch(new eventActions.LoadParticipants(ev.uuid));
              }
            }
          }
          )
        );
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

