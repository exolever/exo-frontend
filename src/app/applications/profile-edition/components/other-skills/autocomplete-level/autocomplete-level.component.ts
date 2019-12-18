import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger, MatOptionSelectionChange } from '@angular/material';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KeywordModel } from '@applications/shared/models/keyword.model';
import { IndustryModel } from '@applications/shared/models/industry.model';

@Component({
  selector: 'app-autocomplete-level',
  templateUrl: './autocomplete-level.component.html',
  styleUrls: ['./autocomplete-level.component.scss']
})
export class AutocompleteLevelComponent implements OnInit {
  @Input() itemList: Array<IndustryModel | KeywordModel> = [];
  @Input() selectedItems: Array<IndustryModel | KeywordModel> = [];
  @Output() onChange = new EventEmitter();
  @ViewChild(MatAutocompleteTrigger, {static: false}) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocomplete, {static: false}) autocomplete: MatAutocomplete;

  public autocompleteControl = new FormControl();
  public filteredItems: Observable<IndustryModel[] | KeywordModel[]>;

  constructor() { }

  ngOnInit() {
    this.filteredItems = this.autocompleteControl.valueChanges.pipe(
      map(name => name ? this.filterItem(name) : this.itemList.slice())
    );
  }

  filterItem(name: string): Array<IndustryModel | KeywordModel> {
    return this.itemList.filter(
      item => new RegExp(name, 'gi').test(item.name));
  }

  addItem(newItem: IndustryModel | KeywordModel): void {
    const exists = this.addedPreviously(newItem);
    if (exists === undefined) {
      this.selectedItems.unshift(newItem);
    }
    this.autocompleteControl.reset();
    this.autocompleteTrigger.closePanel();
    this.onChange.emit();
  }

  addedPreviously(newItem: IndustryModel | KeywordModel): IndustryModel | undefined {
    return this.selectedItems.find(item => item.name === newItem.name);
  }

  selectedOption(option: MatOptionSelectionChange): void {
    if (option.source.selected) {
      const newItem = option.source.value;
      newItem.setLevel(1);
      this.addItem(newItem);
      this.deselectedOption();
    }
  }

  deselectedOption() {
    // By default the option continues selected so it will not appear as disabled.
    // The behabiour we want is the option appear disabled at the beginning
    this.autocomplete.options.forEach(opt => {
      if (opt.selected) {
        opt.deselect();
      }
    });
  }

  removeItem(item: IndustryModel | KeywordModel): void {
    const index = this.selectedItems.findIndex(i => i.name === item.name);
    if (index !== -1) { this.selectedItems.splice(index, 1); }
    this.onChange.emit();
  }

  change() {
    this.onChange.emit();
  }
}
