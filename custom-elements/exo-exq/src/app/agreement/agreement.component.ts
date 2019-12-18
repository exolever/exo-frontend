import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { English, LanguagesEnum, Spanish } from '../translations';

@Component({
  selector: 'exq-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  translations: any;
  @Input() lang: string;
  @Output() change = new EventEmitter();

  ngOnInit() {
    this.initializeTranslations();
  }

  initializeTranslations() {
    if (this.lang === LanguagesEnum.English) {
      this.translations = English;
    }
    if (this.lang === LanguagesEnum.Spanish) {
      this.translations = Spanish;
    }
  }

  onChange($event) {
    this.change.emit($event.checked);
  }
}
