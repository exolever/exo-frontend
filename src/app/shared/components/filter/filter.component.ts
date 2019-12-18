import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';

export interface IFilterOption {
  name: string;
  pk: string;
  selected?: boolean;
  showByDefault?: boolean;
  optionsToUnmark?: Array<string>;
}

export interface IFilter {
  dirty: boolean;
  isRadioButton?: boolean;
  name: string;
  slug: string;
  options: IFilterOption[];
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() id: string;
  @Input() nameFilter: string;
  @Input() allowSearch: boolean;
  @Input() options: Array<IFilterOption> = [];
  @Input() isRadioButton = false;
  @Output() optionSelected = new EventEmitter();

  listToSearch: Array<IFilterOption> = [];
  listToShow: Array<IFilterOption> = [];

  filteredOptions: Observable<IFilterOption[]>;
  optionsForm: FormArray;
  optionToAdd: FormControl = new FormControl();
  filters: Array<string> = [];
  filtersCounter = 0;

  constructor(
    private fb: FormBuilder
  ) {
    this.optionsForm = this.fb.array([]);
  }

  ngOnInit() {
    this.configureArrays();
    this.filteredOptions = this.optionToAdd.valueChanges.
      pipe(
        startWith(null),
        filter(value => typeof value === 'string'),
        map(value => this.options.filter(opt => opt.name.toLowerCase().includes(value.toLowerCase())))
      );
  }

  ngOnChanges() {
    this.reloadForm();
  }

  reloadForm () {
    this.filters = [];
    this.optionsForm = this.fb.array([]);
    this.configureArrays();
    this.listToShow.forEach(opt => {
      this.optionsForm.push(new FormControl(opt.selected ? true : false ));
      if (opt.selected) {
        this.filters.push(opt.pk);
      }
    });
    this.manageFilterCounter();
  }

  configureArrays() {
    this.listToSearch = this.options.filter(opt => opt.showByDefault === false ) || [];
    this.listToShow = this.options
        .filter(opt => opt.showByDefault === true )
      || [];
  }

  getFirstValueSelected() {
    return this.filters.length > 0 ? this.filters[0] : undefined;
  }

  optionChecked(option: IFilterOption): boolean {
    return this.filters.includes(option.pk) || (option.selected && !this.isRadioButton);
  }

  onSelectionChange($event) {
    // A selection change includes selection and deselection of an option.
    if (!$event.isUserInput) {
      // When you select a different option, you are implicitly deselecting the old one.
      return;
    }
    const optionSelected = $event.source.value;
    // Add the option selected to the checkboxes list
    optionSelected.selected = true;
    this.listToShow.push(optionSelected);

    const optionToRemove = this.listToSearch.findIndex(opt => opt.pk === optionSelected.pk);
    if (optionToRemove >= 0) {
      this.listToSearch.splice(optionToRemove, 1);
    }

    this.optionsForm.push(new FormControl());
    this.filters.push(optionSelected.pk);
    // Reset form control
    this.optionToAdd.reset();
    this.unmarkOptions($event.source.value.pk);
    // Emit the event
    this.optionSelected.emit({name: this.nameFilter, values: this.filters});
    this.reloadForm(); // It needed re-init the form to manage new added options
  }

  onRadioChange($event) {
    const optionSelected = $event.source.value;
    this.filters = [optionSelected];
    this.listToShow.map((item) => {
      if (item.selected) {
        delete item.selected;
      }

      if (item.pk === optionSelected) {
        item.selected = true;
      }
    });
    this.optionSelected.emit({name: this.nameFilter, values: this.filters});
    this.manageFilterCounter();
  }

  onCheckboxChange($event) {
    const pk = $event.source.value;
    const isAdded = $event.source.checked;
    // Unmark other
    this.unmarkOptions($event.source.value);
    // Update the list and update the counter
    this.updateFilterList(pk, isAdded);
    this.manageFilterCounter();
    // Emit the event
    this.optionSelected.emit({name: this.nameFilter, values: this.filters});
  }

  unmarkOptions(pk): void {
    const unmarkList = this.listToShow.find(opt => opt.pk === pk).optionsToUnmark;
    let optionsToUnmark;
    if  (unmarkList)  {
      optionsToUnmark = this.options.filter(opt => unmarkList.includes(opt.pk));
    }

    if (optionsToUnmark) {
      optionsToUnmark.forEach(opt => opt.selected = false);
      optionsToUnmark.map(opt => {
        const it = this.listToShow.findIndex(item => item.name === opt.name);
        if (it >= 0) { // If this option is visible to unmark
          this.optionsForm.controls[it].setValue('');
          this.updateFilterList(opt.pk, false);
        }
      });
    }
  }

  updateFilterList(pk: string, toAdd: boolean) {
    this.filters = toAdd ? this.filters.concat([pk]) : this.filters.filter(f => f !== pk);
  }

  isAddedPreviously(option: any): any {
    return this.listToShow.find(item => item.pk === option.pk);
  }

  manageFilterCounter() {
    this.filtersCounter = this.filters.filter (f => f !== this.nameFilter).length;
  }

  displayOption(opt: IFilterOption): string {
    return opt ? opt.name : '';
  }
}
