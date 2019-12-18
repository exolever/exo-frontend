import {
  Component, Input, Output, EventEmitter,
  ElementRef, AfterContentChecked, ChangeDetectorRef
} from '@angular/core';
import { nameFeedbackImageEnum } from './feedback-images.enum';

@Component({
  selector: 'app-feedback-message',
  templateUrl: './feedback-message.component.html',
  styleUrls: ['./feedback-message.component.scss']
})
export class FeedbackMessageComponent implements AfterContentChecked {

  @Input() body: string;
  @Input() subtitle: string;
  @Input() title: string;
  @Input() buttonText: string;
  @Input() imageFeedback: nameFeedbackImageEnum;
  @Output() clickedButton: EventEmitter<boolean> = new EventEmitter();
  @Output() clickedCallBack: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef, private render: ChangeDetectorRef) { }

  ngAfterContentChecked() {
    this.render.detectChanges();
    if (this.elementRef.nativeElement.querySelector('.onClick')) {
      this.elementRef.nativeElement.querySelector('.onClick')
        .addEventListener('click', () => this.onCallBack(this));
    }
  }

  onClick() {
    this.clickedButton.emit(true);
  }
  onCallBack(event) {
    this.clickedCallBack.emit(event);
  }
}
