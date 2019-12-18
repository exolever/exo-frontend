/// <reference types="googlemaps" />

import { Directive, ElementRef, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

import { MapsAPILoader } from '@agm/core';

import { IGooglePlace } from './google-place.interface';


const DEFAULTHEIGHTAUTOCOMPLETE = 352;
const EXTRAMARGIN = 30; // Some extra margin in order to see well the information
@Directive({
  selector: '[google-place]'
})

export class GooglePlacesDirective implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;
  private data: IGooglePlace = { name: '', placeId: '' };
  private observer;
  constructor(elRef: ElementRef, private mapsAPILoader: MapsAPILoader) {
    this.element = elRef.nativeElement;
  }

  @HostListener('focus')
  focusListener(): void {
    const clientRect = this.element.getBoundingClientRect();
    const offsetTop = clientRect.top;
    const heightScreen = window.innerHeight;
    this.createObserverAutocompletePanel(offsetTop, heightScreen);
  }

  @HostListener('blur')
  blurListener(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('change') changeValue() {
    const inputValue = this.element.value;
    // If the user has a previous correct value in the input and insert a wrong value
    // remove the value of placeId because this value is not update automatically
    if (inputValue !== this.data.name) {
      this.data.placeId = '';
      this.data.name = inputValue;
      this.onSelect.emit(this.data);
    }
  }

  dataToSend(googlePlace: google.maps.places.PlaceResult): void {
    this.data = { name: googlePlace.name, placeId: googlePlace.place_id };
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.element, { types: ['(regions)'], fields: ['name', 'place_id'] }
      );
      // Event listener to monitor place changes in the input
      autocomplete.addListener('place_changed', () => {
        // Emit the new address object for the updated place
        this.dataToSend(autocomplete.getPlace());
        if (this.data) {
          this.onSelect.emit(this.data);
        }
      });
    });
  }

  private createObserverAutocompletePanel(offsetTop: number, heightScreen: number) {
    const autocompletePanel = <HTMLElement>document.querySelector('.pac-container');
    if (autocompletePanel) {
      this.observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
              this.applyNewMargin(offsetTop, heightScreen, autocompletePanel);
            }
        }
      });
      const config = { attributes: false, childList: true, subtree: false };
      this.observer.observe(autocompletePanel, config);
    }
  }

  private applyNewMargin(offsetTop: number, heightScreen: number, autocompletePanel: HTMLElement) {
    const heightAutocompletePanel = (autocompletePanel.clientHeight || DEFAULTHEIGHTAUTOCOMPLETE);
    if ((offsetTop + heightAutocompletePanel) > heightScreen) {
      const margin = heightAutocompletePanel + EXTRAMARGIN;
      autocompletePanel.style.marginTop = `-${margin}px`;
    } else {
      autocompletePanel.style.marginTop = '0px';
    }
  }
}
