import { Component, DoCheck, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatFormFieldControl, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatButton
} from '@angular/material';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';

import { fromEvent as observableFromEvent, Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-chips-autocomplete',
  templateUrl: './chips-autocomplete.component.html',
  styleUrls: ['./chips-autocomplete.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: ChipsAutocompleteComponent },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChipsAutocompleteComponent), multi: true }
  ]
})
export class ChipsAutocompleteComponent implements MatFormFieldControl<ChipsAutocompleteComponent>,
  ControlValueAccessor,
  OnInit, DoCheck, OnDestroy {
  /** NgForms stuff */
  formControl = new FormControl();
  /** the value of the input element and the elementRef to the native HTML input*/
  inputEl = '';
  @ViewChild('inputElHTML', {static: false}) inputElHTML: ElementRef;
  /** MatFormFieldControl interface */
  ngControl: NgControl = null;
  /** id of the control */
  id = `app-chips-autocomplete`;
  /** weather the parent form has been submitted to display errors in case it is necessary */
  @Input() isSubmitted = false;
  /** to detect the submit event, we can also pass a MatButton reference of the parent form
   *  in order to avoid having to set up manually the isSubmitted boolean in the form */
  @Input() buttonRef: MatButton;
  /** MatFormField subscribes to this to run change detection */
  stateChanges: Subject<void> = new Subject<void>();
  /** some MatFormField state properties */
  focused = false;
  /** keeps the value of the material error display state */
  private _errorState = false;
  private _disabled = false;
  private _empty = true;
  private _value = undefined;
  private _required = true;
  private subscriptions: Array<Subscription> = [];
  /** MatAutocomplete stuff */
  removable = true;
  filterAutocompleteList: Array<any>;
  @ViewChild( MatAutocompleteTrigger, {static: false}) acTrigger: MatAutocompleteTrigger;
  /** MatChips stuff */
  private _chipItemListToShow: Array<any> | null = [];
  /** ChipsAutocompleteConfig. These parameters must be passed as attributes by the parent */
  /** The Material's floating placeholder text */
  @Input() placeholder = '';
  /** The model of the autocomplete list items, it must include a constructor that accepts a value and
   *  returns a new item belonging to that model */
  @Input() modelAutocompleteItem;
  /** weather the autocomplete should allow for custom keyboard input additions to the chip list */
  @Input() requireMatch = false;
  /** weather input value should be added to the chip list on blur of the input field */
  @Input() addInputValueOnBlur = false;
  /** Array of items to use in the autocomplete component */
  @Input() autocompleteListItems: Array<any> = [];
  /** Control Value Accessor stuff */
  propagateChange: Function = () => {};
  /** display function for the autocomplete, for every element, this will be the returned value to display in the
   *  template. By default displays a property of the object "name" */
  @Input() displayFn: ( el: any ) => string = ( el?: any ) => (el ? el.name ? el.name : el : undefined);
  /** Should the input be disabled */
  @Input() set disabled( disabled ) {
    this._disabled = disabled;
  }
  get disabled() {
    return this._disabled;
  }
  @Input() set required( required ) {
    this._required = required;
  }
  get required() {
    return this._required;
  }
  /** the chip list item's getter && setter of the form controller */
  get chipItemListToShow() {
    return this._chipItemListToShow;
  }
  set chipItemListToShow( val ) {
    this._chipItemListToShow = val;
    this.propagateChange( this._chipItemListToShow );
    this.setErrorState();
  }
  /** visible value of the form field from it's parent form element */
  get value(): any {
    return this._value;
  }
  set value( valuesList: any ) {
    this._value = valuesList;
  }
  /** the error state to communicate mat form field weather to display the error visualization or not */
  get errorState(): boolean {
    return this._errorState;
  }
  set errorState( nextState: boolean ) {
    if ( this.stateChanges ) {
      this._errorState = nextState;
      this.stateChanges.next();
    }
  }
  /** Whether the control is empty */
  get empty() {
    return this._empty;
  }
  /** weather the placeholder should float */
  get shouldLabelFloat() {
    return this.chipItemListToShow.length > 0 || ( this.inputEl && this.inputEl.length > 0 ) || this.focused;
  }
  /** lifecycle hooks */
  ngOnInit() {
    if ( this.buttonRef ) {
      this.subscriptions.push(
        observableFromEvent( this.buttonRef._elementRef.nativeElement, 'click' )
          .subscribe( () => {
            if ( !this.isSubmitted ) {
              this.isSubmitted = true;
              this.ngDoCheck();
            }
          })
      );
    }
  }
  ngDoCheck() {
    if ( this.isSubmitted ) { this.setErrorState(); }
  }
  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe() );
  }

  /** FormControl logic */
  clearFormControl(): void {
    // for some reason the ngModel does not update input value when selecting from list from keyboard, so also reset it
    // TODO: do not access DOM element directly, manipulate the input in some other way
    this.inputEl = this.inputElHTML.nativeElement.value = '';
    this.onInputChange( this.inputEl );
  }
  onInputBlur( e: Event ) {
    this.focused = false;
    if ( this.addInputValueOnBlur ) {
      this.onAddManualData( (<HTMLInputElement>e.target).value );
    }
  }
  /** get the data from a keydown input event and pass it to the corresponding method to be added */
  enterKeydown( e: Event ): void {
    this.onAddManualData( (<HTMLInputElement>e.target).value );
  }
  /** Manually add a string value to the chip list, discarding those already added and adding element from autocomplete
   *  in case string is detected as an autocomplete list item element
   */
  onAddManualData( item: any ) {
    if (
      this.inputEl &&
      !this.isAlreadyManualInputAdded( item ) &&
      !this.acTrigger.activeOption &&
      !this.requireMatch
    ) {
      const valueToAdd = this.isManualInputMatchingAnAutocompleteListItem( item ) ?
        this.autocompleteListItems[ this.getAutocompleteListElementIndexFromName( item ) ] :
        new this.modelAutocompleteItem( item );
      this.onOptionSelected( valueToAdd );
    } else {
      this.clearFormControl();
    }
  }

  /** MatFormControl logic */
  /** Sets the list of element IDs that currently describe this control. */
  setDescribedByIds(): void {}
  /** Handles a click on the control's container. */
  onContainerClick(): void {}

  /** Autocomplete logic */
  /** method to get the value of the selected autocomplete option and call the add method */
  onAutocompleteOptionSelected( e: MatAutocompleteSelectedEvent ): void {
    this.onOptionSelected( e.option.value );
  }
  /** function fired every time there is a select event from the autocomplete */
  onOptionSelected( selectedItem: any ): void {
    this.writeValue([ ...this.chipItemListToShow, selectedItem ]);
    this.acTrigger.closePanel();
    this.clearFormControl();
  }
  /** returns an array of all the items of the autocomplete with those selected trimmed to avoid repetition */
  autocompleteUnselectedItems(): Array<any> {
    return this.autocompleteListItems
      .filter( el =>
        // there is not consistency on the returned type of the pk, so always transform to string
        !this.chipItemListToShow
          .map( chip => chip.pk ? chip.pk.toString() : chip ).includes( el.pk.toString() ));
  }
  /** function used to filter keywords based on regular expression match */
  filterAutocompleteFn( value: string ): Array<any> {
    return value ?
      this.autocompleteUnselectedItems().filter(item => new RegExp(`${value}`, 'gi').test( item.name )) :
      this.autocompleteUnselectedItems();
  }
  /** to refresh autocomplete available items list */
  onInputChange( val: string ) {
    this.inputEl = val;
    this.filterAutocompleteList = this.filterAutocompleteFn( val );
  }

  /** MatChips logic */
  /** Removes an item from the list of the chips items */
  removeChipItem( index: number ) {
    this.chipItemListToShow.splice( index, 1 );
    this.writeValue( this.chipItemListToShow, true );
  }
  /** Control Value Accessor logic */
  writeValue( val: any, isRemoved?: boolean ): void {
    if ( val && val.length || isRemoved ) { this.chipItemListToShow = val; }
  }
  registerOnChange( fn: Function ): void {
    this.propagateChange = fn;
  }
  registerOnTouched(): void {}

  /** Helper methods */
  /** checks if manual input is already on the chip list */
  isAlreadyManualInputAdded( kbInput: string ): boolean {
    return this.chipItemListToShow.map(
      el => el.name ? el.name.toLowerCase().replace(/ /g, '' ) : el.toLowerCase().replace(/ /g, '' ) )
      .includes( kbInput.toLowerCase().replace(/ /g, '' ));
  }
  /** checks if manual input matches the string of an autocomplete element's name */
  isManualInputMatchingAnAutocompleteListItem( kbInput: string ): boolean {
    return this.autocompleteListItems.map( el => el.name.toLowerCase().replace(/ /g, '' ))
      .includes( kbInput.toLowerCase().replace(/ /g, '' ));
  }
  /** when we know a manual input is on the list, this returns the element of the autocomplete list */
  getAutocompleteListElementIndexFromName( kbInput: string ): number {
    return this.autocompleteListItems.map( el => el.name.toLowerCase().replace(/ /g, '' ))
      .indexOf( kbInput.toLowerCase().replace(/ /g, '' ));
  }
  /** sets the error state of the MatFormFieldControl */
  setErrorState( focusout?: boolean ): void {
    if ( focusout ) { this.focused = false; }
    this.errorState = !this.chipItemListToShow.length && this.required;
  }

}
