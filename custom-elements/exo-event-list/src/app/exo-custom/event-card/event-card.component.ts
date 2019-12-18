import {Component, Input, OnInit} from '@angular/core';

import { Event, Participants, Trainer } from '../event.model';

@Component({
  selector: 'exo-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;
  @Input() domain: string;
  public translations: { free: string; hosted: string };

  ngOnInit(): void {
    this.initializeTranslations();
  }

  initializeTranslations() {
    const isSpanish = window.location.href.includes('es.openexo.com');
    if ( isSpanish ) {
      this.translations = {
        free: 'GRATIS',
        hosted: 'Organizado por',
      };
    } else {
      this.translations = {
        free: 'FREE',
        hosted: 'Hosted by',
      };
    }
  }

  isPastEvent(date: Date): boolean {
    return date < new Date();
  }

  isFree(event): boolean {
    return event.price === 'Free';
  }

  hasMoreInfo(): boolean {
    return this.event.url !== null && !!this.event.url.length;
  }

  goToMoreInfo(): void {
    if ( this.hasMoreInfo() ) {
      window.open(this.event.url || this.event.link, '_blank');
    }
  }

  getTrainer(): Trainer {
    return this.event.trainer;
  }

  getMainSpeaker(): Participants {
    return this.event.participants.filter(p => p.order === 0)[0];
  }

  openProfile($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    window.open(this.getTrainer().profileUrl, '_blank');
  }
}
