import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbService} from '@applications/breadcrumb/service/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {Event} from '@ecosystem/modules/events/store/event.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '@core/store/reducers';
import * as fromEvents from '../../store/events.reducer';
import {Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {
  EventFormComponent} from '@ecosystem/modules/events/components/events-form-layout/event-form/event-form.component';
import {EventEditionGuard} from '@ecosystem/modules/events/components/modal-save-changes.guard';
import { EventService } from '@ecosystem/modules/events/service/events.service';


@Component({
  selector: 'app-events-form-layout',
  templateUrl: './events-form-layout.component.html',
  styleUrls: ['./events-form-layout.component.scss'],
})
export class EventsFormLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('formComponent', {static: false}) formComponent: EventFormComponent;
  isDirty = false;
  uuidEvent: string;
  event$: Observable<Event>;
  eventPreview: Event;
  isReviewer = false;
  private subscriptions = new Subscription;

  constructor(
    private translateService: TranslateService,
    private breadCrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private guard: EventEditionGuard,
    private eventService: EventService,

  ) {
  }

  ngOnInit(): void {
    this.event$ = this.store.pipe(select(state => fromEvents.getSelectedEvent(state)));
    this.route.url.subscribe(url => {
      if (url && url.find(segment => segment.path === 'review')) {
        this.isReviewer = true;
      }
    });
    this.route.params.subscribe(routeParams => {
      this.uuidEvent = routeParams['uuid'];
      if (!this.uuidEvent) {
        this.breadCrumbService.updateBreadCrumb({
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EVENTS.CREATE')
        });
      } else {
        if (this.isReviewer) {
          this.event$ = this.eventService.getEventFromReviewer(this.uuidEvent);
        }
        this.breadCrumbService.updateBreadCrumb({
          label: this.translateService.instant('ECOSYSTEM.BREADCRUMBS.EVENTS.INFO')
        });
      }
    });
    this.subscriptions.add(this.guard.result$.pipe(
      filter((result) => result === true)
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onFormChange($event: any) {
    this.eventPreview = $event;
  }
}
