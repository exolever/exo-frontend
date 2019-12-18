import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-material-icon-star-rating',
  templateUrl: './material-icon-star-rating.component.html',
  styleUrls: ['./material-icon-star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaterialIconStarRatingComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialIconStarRatingComponent implements ControlValueAccessor, OnInit {
  /** the value to be of the star rating */
  @Input() rating: number;
  /** the number of starts to show */
  @Input() numberOfGrades: number;
  /** the interaction mode of the star rating component */
  @Input() readOnly = false;
  /** display stars which have marked class */
  @Input() showOnlyFilled = false;
  /** allow half starts in the display and rating */
  @Input() allowHalf = false;
  /** size of the stars, either large or small */
  @Input() size: string;
  /** array that is iterated to show as many stars as needed */
  iterations: Array<any>;
  /** Control Value Accessor stuff */
  propagateChange: Function = () => {};
  /** accessor to the value of the form control */
  get value() {
    return this.rating;
  }
  set value(val) {
    this.rating = val;
    this.propagateChange(this.rating);
  }

  /** lifecycle hooks */
  ngOnInit() {
    this.iterations = new Array<any>(this.numberOfGrades);
    if (this.rating) {
      this.value = Math.round( this.rating * 10 ) / 10;
    }
  }

  /**
   * returns the star shape to display
   * @param {number} currentIteration
   */
  getStarShape(currentIteration: number): string {
    const halfStarMinValue = 0.25;
    const fullStarMinValue = 0.75;

    return this.value - currentIteration >= fullStarMinValue ?
      'star' : this.value - currentIteration >= halfStarMinValue ?
        'star_half' :
        'star_border';
  }

  /**
   * function to rate manually, only availble when component set in rate mode
   * @param value
   * @param event
   */
  rate(value: number, event: MouseEvent) {
    if (!this.readOnly) {
      if (this.allowHalf) {
        this.writeValue(event.offsetX < (event.target as HTMLElement).offsetWidth / 2 ? value + 0.5 : value + 1);
      } else {
        this.writeValue(value + 1);
      }
    }
  }

  /** form control methods */
  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

}
