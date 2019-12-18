import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  ChangeDetectorRef,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent implements OnInit {
  @Input() initialValue: number;
  @Input() answerPk: string;
  @Output() voted: EventEmitter<number> = new EventEmitter<number>();
  showRate = false;
  private wasInside = false;
  form: FormGroup;

  // hide rating when clicking outside component
  @HostListener('click') clickIn() {
    if (this.showRate) {
      this.wasInside = true;
    }
  }

  @HostListener('document:click') clickOut() {
    if (this.showRate) {
      if (!this.wasInside) {
        this.showRate = false;
      }
      this.wasInside = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // make sure the input is within range
    this.initialValue = this.initialValue > 5 ? 5 : this.initialValue < 0 ? 0 : this.initialValue;
    this.form = this.createForm();
  }

  /**
   * create the form
   */
  createForm(): FormGroup {
    return this.fb.group({
      'given-rating': [this.initialValue || 0]
    });
  }

  /**
   * on clicked on a rating
   */
  onSubmit(): void {
    const rating = this.form.controls['given-rating'].value;
    if (rating !== 0 && rating !== this.initialValue) {
      this.showRate = false;
      this.changeDetector.detectChanges();
      this.voted.emit(rating);
      this.initialValue = rating;
    }
  }
}
