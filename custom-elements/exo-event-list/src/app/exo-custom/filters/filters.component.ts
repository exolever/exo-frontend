import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChildren,
  QueryList,
  Renderer2,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SelectDropDownComponent } from 'ngx-select-dropdown';

import { Event } from '../event.model';
import { ConfigSelect, IFilters } from '../filter.interface';

@Component({
  selector: 'exo-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, AfterViewInit {
  @Input() events: Event[];
  @Input() countryOptions: string[] = [];
  @Input() languageOptions: string[] = [];
  @Input() selectedFilters: IFilters;
  @Input() inDialog = false;

  @Output() selectedOptions = new EventEmitter<any>();
  @ViewChildren(SelectDropDownComponent) selectList: QueryList<SelectDropDownComponent>;

  private genericConfig: ConfigSelect = {
    search: false,
    placeholder: '',
    moreText: ' ',
    height: 'auto',
    noResultsFound: 'No results found'
  };

  form: FormGroup;
  followTypeConfig: ConfigSelect;
  typeEventConfig: ConfigSelect;
  countryConfig: ConfigSelect;
  languageConfig: ConfigSelect;
  followTypeOptions = [
    { code: 'P', name: 'On site' },
    { code: 'S', name: 'Streaming + On Site' },
    { code: 'V', name: 'Virtual' }
  ];
  typeEventOptions = [
    { code: 'S', name: 'ExO Summits' },
    { code: 'W', name: 'Workshops' },
    { code: 'B', name: 'Book launches' },
    { code: 'T', name: 'Talks' },
    { code: 'E', name: 'Webinars' }
  ];

  constructor(private dialog: MatDialog, private renderer: Renderer2) { }

  ngOnInit() {
    this.createFilters();
  }

  ngAfterViewInit() {
    this.manageClassSelectedOption();
  }

  createFilters() {
    this.form = new FormGroup({
      category: new FormControl(this.selectedFilters ? this.selectedFilters.category : []),
      followType: new FormControl(this.selectedFilters ? this.selectedFilters.followType : []),
      country: new FormControl(this.selectedFilters ? this.selectedFilters.country : []),
      languages: new FormControl(this.selectedFilters ? this.selectedFilters.languages : []),
    });
    this.followTypeConfig = { ...this.genericConfig, ...{ placeholder: 'Type', displayKey: 'name' } };
    this.typeEventConfig = { ...this.genericConfig, ...{ placeholder: 'Event', displayKey: 'name' } };
    this.countryConfig = { ...this.genericConfig, ...{ placeholder: 'Country' } };
    this.languageConfig = { ...this.genericConfig, ...{ placeholder: 'Language' } };
  }

  selectionChanged($event) {
    this.manageChangeOption();
  }

  manageChangeOption() {
    this.selectedOptions.emit(this.form.getRawValue());
    this.manageClassSelectedOption();
  }

  clearFilters() {
    this.form.reset({
      category: [],
      followType: [],
      country: [],
      languages: []
    });
    this.selectList.toArray().map(component => {
      component.ngOnInit(); // Reload the component.
    });
    this.manageChangeOption();
  }

  manageClassSelectedOption() {
    // When the filter has selected options we need adding a class to manage some specific styles
    this.selectList.toArray().map(component => {
      if (component.selectedItems.length > 0) {
        this.renderer.addClass(component._elementRef.nativeElement, 'selected-option');
      } else {
        this.renderer.removeClass(component._elementRef.nativeElement, 'selected-option');
      }
    });
  }

}
