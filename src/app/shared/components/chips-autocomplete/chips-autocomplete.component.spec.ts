import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { configTestBed } from '@testing/test.common.spec';

import { ChipsAutocompleteComponent } from './chips-autocomplete.component';

describe('ChipsAutocompleteComponent', () => {
  let component: ChipsAutocompleteComponent;
  let fixture: ComponentFixture<ChipsAutocompleteComponent>;

  const moduleDef: TestModuleMetadata = {
    declarations: [ ChipsAutocompleteComponent ],
    imports: [
      FormsModule,
      MatAutocompleteModule,
      MatChipsModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect( component ).toBeTruthy();
  });

  it( 'should be able to write values in the input field', () => {
    const strVal = 'A random value';
    component.inputEl = strVal;
    const inputEl = fixture.debugElement.query(By.css( 'input' ));

    expect( inputEl ).toBeDefined();

    inputEl.nativeElement.value = strVal;
    fixture.detectChanges();
    expect( component.inputEl ).toEqual( strVal );
  });

  it( 'given that there value has an input or there are mat chips in the list, should float placeholder', () => {
    component.chipItemListToShow = [];
    component.inputEl = '';

    expect( component.shouldLabelFloat ).toBeFalsy();

    // has chips
    component.chipItemListToShow = [ 'Hey there, I\'m a chip :)' ];
    expect( component.shouldLabelFloat ).toBeTruthy();

    // input has a value
    component.chipItemListToShow = [];
    component.inputEl = 'Don\'t judge me, I\'m valuable';
    expect( component.shouldLabelFloat ).toBeTruthy();

    // input has value and there are chips
    component.chipItemListToShow = [ 'Hey there, I\'m a chip :)' ];
    expect( component.shouldLabelFloat ).toBeTruthy();
  });

  it( 'should create chip from keywords array', () => {
    component.chipItemListToShow = [ 'Hey there, I\'m a chip :)' ];
    fixture.detectChanges();

    const chipEl = fixture.debugElement.query(By.css( 'mat-chip' ));
    expect( chipEl ).toBeDefined();
    expect( chipEl.nativeElement.innerHTML ).toContain( component.chipItemListToShow[0] );

    const chipElArr = fixture.debugElement.queryAll(By.css( 'mat-chip' ));
    expect( chipElArr.length ).toEqual( 1 );
  });

  it( 'should remove chip element when chip remove button clicked', () => {
    const spyRemoveChip = spyOn( component, 'removeChipItem' ).and.callThrough();
    const chipToDelete = 'I will disappear soon :(';
    component.chipItemListToShow = [ 'chip1', 'chip2', 'chip3', chipToDelete ];
    fixture.detectChanges();
    const chipElArray = fixture.debugElement.queryAll(By.css( 'mat-chip' ));

    // last chip is last array element
    expect( chipElArray[ component.chipItemListToShow.length - 1 ].nativeElement.innerHTML ).toContain( chipToDelete );
    const removeChipButton =
      chipElArray[ component.chipItemListToShow.length - 1 ].nativeElement.querySelector('.mat-chip-remove');
    removeChipButton.click();
    fixture.detectChanges();

    // requested to delete last array element
    expect( spyRemoveChip ).toHaveBeenCalledWith( component.chipItemListToShow.length );

    // successfully deleted requested chip from array
    expect( component.chipItemListToShow.length ).toEqual( 3 );
    expect( component.chipItemListToShow.includes( chipToDelete ) ).toBeFalsy();
  });

  it( 'should not add a new keyboard input if it\'s already present on the list', () => {
    component.chipItemListToShow = [ 'chip1', 'chip2', { name: 'chip3', pk: '13'} ];

    // this stuff should be detected as present
    expect( component.isAlreadyManualInputAdded( component.chipItemListToShow[0].toUpperCase() ) ).toBeTruthy();
    expect( component.isAlreadyManualInputAdded( component.chipItemListToShow[2].name ) ).toBeTruthy();

    // this stuff should be added because it's not on the list
    expect( component.isAlreadyManualInputAdded( 'random and totally not in that list string'.toUpperCase() ))
      .toBeFalsy();
    expect( component.isAlreadyManualInputAdded( 'random and totally not in that list string' )).toBeFalsy();
  });

  it( 'should return the index of an autocomplete list item by it\'s string', () => {
    component.autocompleteListItems = [ { pk: '13', name: 'item1' }, { pk: '19', name: 'Item2 with sTRAnge nAmE' } ];

    // values stressed with capitals and trimmed spaces
    expect( component.getAutocompleteListElementIndexFromName( component.autocompleteListItems[0].name.toUpperCase() ) )
      .toBe( 0 );
    expect(
      component
        .getAutocompleteListElementIndexFromName( component.autocompleteListItems[1].name.toLowerCase()
          .replace(/ /g, '' ))).toBe( 1 );
  });

});
