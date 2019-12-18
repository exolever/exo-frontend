import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { English, LanguagesEnum, Spanish } from '../translations';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'exq-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  @Output() clickAction = new EventEmitter();
  @Input() lang: string;
  language: FormControl;
  translations: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeTranslations();
    this.language = new FormControl(this.lang);
  }

  initializeTranslations() {
    if (this.lang === LanguagesEnum.English) {
      this.translations = English;
    }
    if (this.lang === LanguagesEnum.Spanish) {
      this.translations = Spanish;
    }
  }

  onStart() {
    this.clickAction.emit();
  }

  onLanguageChange($event) {
    const newUrl = window.location.href.replace(`lang=${this.lang}`, `lang=${$event.value}`);
    window.location.href = newUrl;
  }
}
