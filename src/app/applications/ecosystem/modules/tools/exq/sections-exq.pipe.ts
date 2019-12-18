import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { NameExqEnum } from './exq.enum';


@Pipe({ name: 'translateSectionExq' })
export class SectionsExqPipe implements PipeTransform {
  constructor(public translate: TranslateService) { }
  transform(section): string {
    return this.translate.instant(`ECOSYSTEM.EXQ.SECTION.${NameExqEnum[section]}`);
  }
}
