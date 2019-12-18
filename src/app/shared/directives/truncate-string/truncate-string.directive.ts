import { AfterViewChecked, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTruncateString]'
})
/**
 * This class will truncate different text, you can choose the length of the text that you want show, the text to
 * truncate the text, and if you want do only in some browser.
 *
 * For example <p appTruncateString="50" [browsers]="['Firefox', 'MSIE', 'Opera']"> will truncate the text by 50
 * characters with '...' only in Firefox, IE and Opera.
 *
 * By default will work in all browsers with 30 length and with '...' truncate text.
 */
export class TruncateStringDirective implements AfterViewChecked {

  @Input('appTruncateString')
  length = 30;

  @Input()
  browsers: string[];

  @Input()
  truncateText = '...';

  constructor(
    private el: ElementRef
  ) { }

  ngAfterViewChecked() {
    if (this.browsers && this.browsers.length > 0) {
      this.browsers.map((browser) => {
        if (window.navigator.userAgent.indexOf(browser) > -1) {
          this.el.nativeElement.textContent = this.truncateString(this.el.nativeElement.textContent, this.length);
        }
      });
    } else {
      this.el.nativeElement.textContent = this.truncateString(this.el.nativeElement.textContent, this.length);
    }
  }

  truncateString(str, num) {
    const text = str.trim();
    return text.length > num ?
      text.slice(0, num > this.truncateText.length ? num - this.truncateText.length : num) + this.truncateText : text;
  }
}
