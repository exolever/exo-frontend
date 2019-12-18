import { Component, Input, OnInit } from '@angular/core';
import { English, LanguagesEnum, Spanish } from '../translations';

@Component({
  selector: 'exq-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @Input() lang: string;
  @Input() score: number;
  @Input() showResults: boolean;
  translations: any;

  constructor() {
  }

  ngOnInit(): void {
    this.initializeTranslations();
  }

  initializeTranslations() {
    if ( this.lang === LanguagesEnum.English ) {
      this.translations = English;
    }
    if ( this.lang === LanguagesEnum.Spanish ) {
      this.translations = Spanish;
    }
  }

  reload() {
    location.reload();
  }

  printTitle(score: number) {
    return `${ score } ${ this.translations.result2 }`;
  }
}
