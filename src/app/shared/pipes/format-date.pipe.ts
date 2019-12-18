import {Pipe} from '@angular/core';

import * as MomentTZ from 'moment-timezone';
import {DateFormatPipe} from 'ngx-moment';

import {LanguageService} from '@applications/shared/services';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({name: 'formatDate'})
export class FormatDatePipe extends DateFormatPipe {
  language: string;
  aliases: { [key: string]: string };

  constructor() {
    super();
    this.language = LanguageService.getLocale();
    this.aliases = LanguageService.getAliases(this.language);
  }

  transform(value: any, pattern: string = 'short'): string | null {
    if (isBlank(value) || value !== value) {
      return null;
    }
    if (!MomentTZ.isMoment(value)) {
      if (!MomentTZ.isMoment(MomentTZ(value))) {
        throw Error(`InvalidPipeArgument: '${value}' for pipe FormatDatePipe`);
      } else {
        value = MomentTZ(value);
      }
    }

    // Add GMT to zone if moment return a number instead a time zone abbreviation.
    let formatTz = super.transform(value, updateYearPattern(value, pattern, this.aliases));
    if (Number(value.format('z')) && pattern === 'long') {
      const regexp = new RegExp('\\((.*?)\\)');
      if (regexp.test(formatTz)) {
        const zoneabbr = regexp.exec(formatTz);
        formatTz = formatTz.replace(zoneabbr[1], `GMT${zoneabbr[1]}`);
      }
    }
    return formatTz;
  }
}

function isBlank(obj: any): boolean {
  return obj === null || obj === '' || obj === undefined;
}

function updateYearPattern(value: MomentTZ.Moment, pattern: string, aliases: { [key: string]: string }): string {
  return value.isSame(MomentTZ(), 'year')
    ? aliases[pattern]
    : aliases[`_${pattern}Year`];
}
