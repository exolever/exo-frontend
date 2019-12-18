import { Component, ChangeDetectionStrategy } from '@angular/core';
import {eventsConfig} from '@ecosystem/modules/events/events.conf';


@Component({
  templateUrl: './events-container.component.html',
  styleUrls: ['./events-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsContainerComponent {
  newEventAddress = eventsConfig.eventsNewEventAddress;
  openEvents() {
    window.open(eventsConfig.eventsPublicAddress, '_blank');
  }
}
