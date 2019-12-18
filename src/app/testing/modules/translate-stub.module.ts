import { NgModule } from '@angular/core';

import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { of as observableOf, Observable} from 'rxjs';


export class TranslateCustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const xhr = new XMLHttpRequest();
    let json = null;

    // By default all assets are served at http://localhost:[PORT]/base/
    xhr.open('GET', `base/src/assets/i18n/${lang}.json`, false);
    xhr.onload = function (e) {
      if (xhr.status === 200) {
        json = JSON.parse(xhr.responseText);
      } else {
        console.error('XHR request failed', `base/src/assets/i18n/${lang}.json`, xhr.statusText);
      }
    };
    xhr.onerror = function (e) {
      console.error('XHR request failed', `base/src/assets/i18n/${lang}.json`, xhr.statusText);
    };
    xhr.send(null);
    return observableOf(json);
  }
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateCustomLoader }
    })
  ],
  exports: [
    TranslateModule
  ]
})
export class TranslateStubModule {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es', 'ja', 'ch', 'pt']);
    this.translate.setDefaultLang('en');
  }
}
