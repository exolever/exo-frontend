import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../event.model';

@Component({
  selector: 'exo-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Output() prevPage = new EventEmitter();
  @Output() nextPage = new EventEmitter();
  @Input() count: number;
  @Input() events: Event[] = [];
  @Input() page: number;
  @Input() prevBtn: boolean;
  @Input() nextBtn: boolean;

  constructor() { }

  onPrev() {
    this.prevBtn = false;
    this.prevPage.emit();
  }

  onNext() {
    this.nextBtn = false;
    this.nextPage.emit();
  }
}
