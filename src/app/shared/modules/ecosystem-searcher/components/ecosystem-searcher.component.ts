import {
  Component, EventEmitter, OnInit, Output, OnChanges, OnDestroy,
  Input, Inject, AfterViewInit, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { UserModel } from '@app/core';
import { ConsultantModel } from '@applications/shared/models';
import { ConsultantListService } from '@applications/shared/services';
import { UserService } from '@core/services';

import {
  IEcosystemSearcherConsultantOptions, IEcosystemSearcherConsultant
} from '../ecosystem-searcher-result.interface';

@Component({
  selector: 'app-ecosystem-searcher',
  templateUrl: './ecosystem-searcher.component.html',
  styleUrls: ['./ecosystem-searcher.component.scss']
})
export class EcosystemSearcherComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Output() update: EventEmitter<ConsultantModel[]> = new EventEmitter<any>();
  @Input() maxResults?: number;
  @Input() isSortable = true;
  @Input() isReadOnly = false;
  @Input() consultants: ConsultantModel[] = [];
  @Input() consultantsExtraOptions: IEcosystemSearcherConsultantOptions[] = [];
  @Input() placeholder?: string;
  @Input() emptyMoment?: string;
  @Input() excludeMe = false;
  @Input() isRequired = false;
  @Input() isSubmitted = false;
  filteredConsultants: ConsultantModel[];
  subscriptions = new Subscription();
  searchField = new FormControl();
  loggedUser: UserModel;
  searcherConsultantItems: IEcosystemSearcherConsultant[] = [];

  constructor(
    private userService: UserService,
    private consultantsService: ConsultantListService,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any,
  ) { }

  ngOnInit(): void {
    // if it is readonly, the sortable will be disabled
    this.isSortable = this.isSortable && !this.isReadOnly;
    this.subscriptions.add(this.userService.user$.subscribe(user => this.loggedUser = user));
    this.subscriptions.add(this.searchField.valueChanges.pipe(
      debounceTime(200),
      // In order to avoid searching in the whole ecosystem, we ask for the first 10
      switchMap(name => name ? this.consultantsService.getConsultants(name, 10) : []),
      map((searchResults) => {
        const uuids = this.consultants.map(i => i.uuid);
        if (this.excludeMe) { uuids.push(this.loggedUser.uuid); }
        return searchResults.filter(consultant => !uuids.includes(consultant.uuid));
      })
    ).subscribe(cons => {
      this.filteredConsultants = cons;
    }));
  }

  ngAfterViewInit() {
    if (this.shouldBeMarkedAsRequired()) {
      this.markAsRequired();
      this.cd.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searcherConsultantItems = this.consultants.map(consultant => {
      const extraOptions = this.consultantsExtraOptions.find(options => options.consultantPk === consultant.uuid);
      return <IEcosystemSearcherConsultant>{
        consultant: consultant,
        canBeDeleted: extraOptions ? extraOptions.canBeDeleted : true,
        template: extraOptions ? extraOptions.template : undefined
      };
    });

    if (changes.isSubmitted && changes.isSubmitted.previousValue !== changes.isSubmitted.currentValue) {
      if (this.shouldBeMarkedAsRequired()) {
        this.markAsRequired();
      }
    }
  }

  onAdd($event: any): void {
    if (this.canAddConsultant()) {
      this.consultants = this.maxResults === 1
        ? [$event.option.value]
        : [...this.consultants, $event.option.value];
      this.update.emit(this.consultants);
      this.searchField.reset();
      this.filteredConsultants = null;
      this.document.activeElement.blur();
      if (this.searchField.hasError('required')) {
        this.searchField.reset();
      }
    } else {
      this.searchField.setValue('');
      this.markAsMaxItemsReached();
    }
  }

  onDelete(consultant: ConsultantModel): void {
    this.consultants = [...this.consultants.filter(c => c.uuid !== consultant.uuid)];
    this.update.emit(this.consultants);
    if (this.searchField.hasError('autocompleteMaxItemsValidator')) {
      this.searchField.reset();
    }
    if (this.shouldBeMarkedAsRequired()) {
      this.markAsRequired();
    }
  }

  canAddConsultant(): boolean {
    return !(this.maxResults && this.maxResults !== 1 && this.maxResults === this.consultants.length);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.consultants, event.previousIndex, event.currentIndex);
    this.update.emit(this.consultants);
  }

  drag() {
    this.document.activeElement.blur();
  }

  private markAsRequired(): void {
    this.searchField.setErrors({'required': true});
  }

  private shouldBeMarkedAsRequired(): boolean {
    return this.isRequired && !this.consultants.length;
  }

  private markAsMaxItemsReached(): void {
    this.searchField.setErrors({'autocompleteMaxItemsValidator': true});
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
