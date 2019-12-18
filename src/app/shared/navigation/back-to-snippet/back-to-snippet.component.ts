import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-back-to-snippet',
  templateUrl: './back-to-snippet.component.html',
  styleUrls: ['./back-to-snippet.component.scss']
})
export class BackToSnippetComponent {
  @Input() priorNavigationTranslateString: string;
  @Output() back: EventEmitter<boolean> = new EventEmitter();
}
