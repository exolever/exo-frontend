import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@core/services';
import { LANGUAGES_CONF } from '@app/app-config';

import { LanguageModel } from '../models/language.model';

@Injectable()
export class LanguageService {
  static allowedLanguages = LANGUAGES_CONF.ALLOWED_LANGUAGES;
  static changeFormatDateLanguages = LANGUAGES_CONF.CHANGE_FORMAT_DATE_LANGUAGES;
  private languages: Array<LanguageModel>;

  static getLocale(): string {
    if (localStorage.getItem(LANGUAGES_CONF.KEY_LOCALSTORAGE)) {
      return localStorage.getItem(LANGUAGES_CONF.KEY_LOCALSTORAGE);
    }

    let lang = LANGUAGES_CONF.DEFAULT_LANGUAGE;
    if (navigator.language) {
      // Only set navigator language if the language is allowed for us.
      if (LanguageService.allowedLanguages.indexOf(navigator.language) !== -1) {
        lang = navigator.language;
      }
    }

    localStorage.setItem(LANGUAGES_CONF.KEY_LOCALSTORAGE, lang);
    return lang;
  }

  /**
   * Return YYYY MMM D instead D MMM YYYY according to locale (ja, zh-hans).
   * @param {string} language
   */
  static getAliases(language: string): {[key: string]: string} {
    return {
      short: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ? 'D MMM' : 'MMM D', // 15 Oct : Oct 15
      shortDateTime: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ?
        'D MMM, HH:mm' : 'MMM D, HH:mm', // 10 Apr, 11:49 : Apr 10, 11:49
      medium: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ?
        'ddd, D MMM' : 'ddd, MMM D', // Sun, 15 Oct : Sun, Oct 15
      long: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ?
        'ddd, D MMM - HH:mm (z)' : 'ddd, MMM D - HH:mm (z)', // Sun, 15 Oct - 17:00 (CEST) : Sun, Oct 15 - 17:00 (CEST)

      // It's a private format. Not use from template.
      _shortYear: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ?
        'D MMM YYYY' : 'YYYY MMM D', // 15 Oct 2018 : 2018 Oct 15
      _mediumYear: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ?
        'ddd, D MMM YYYY' : 'ddd, YYYY MMM D', // Mon, 15 Oct 2018 : Mon, 2018 Oct 15
      _longYear: LanguageService.changeFormatDateLanguages.indexOf(language) === -1 ?
        'ddd, D MMM YYYY - HH:mm (z)' : 'ddd, YYYY MMM D - HH:mm (z)',
      // Sun, 15 Oct 2017 - 17:00 (CEST) : Sun, 2017 Oct 15 - 17:00 (CEST)
      _apiFormat: 'YYYY-MM-DD', // 2019-06-14
      _longFormat: 'MMMM Do YYYY' // May 16th 2014
    };
  }

  constructor(private urlService: UrlService, private authHttp: HttpClient) { }

  getLanguages(): Observable<Array<LanguageModel>> {
    const url = this.urlService.resolveAPI(ApiResources.LANGUAGES);
    return this.authHttp.get<Object[]>(url).pipe(map(resp => {
      this.languages = this.parseResponse(resp);
      return this.languages;
    }));
  }
  parseResponse(res): Array<LanguageModel> {
    return res.map(lang => {
      const pk = lang.pk ? lang.pk : lang.id;
      return new LanguageModel(lang.name, pk);
    });
  }
  filterLanguages(value: string): Array<LanguageModel> {
    return this.languages.filter((item: LanguageModel) =>
      item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }
}
