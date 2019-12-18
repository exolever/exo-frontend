import { Pipe, PipeTransform} from '@angular/core';

import * as MomentTZ from 'moment-timezone';

import { removeUnderscore } from '../helpers/string.helper';


@Pipe({name: 'formatTimezone'})
export class FormatTimezonePipe implements PipeTransform {

  static _ALIASES: {[key: string]: string} = {
    short: 'z', // Asia/Dubai +04
    long: 'UTCZ (z)' // Asia/Dubai UTC+04:00 (+04)
  };

  transform(value: any, pattern: string = 'short'): string|null {

    if (isBlank(value) || value !== value) { return null; }

    if (typeof value !== 'string') {
      throw Error(`InvalidPipeArgument: '${value}' for pipe FormatTimezonePipe`);
    }

    return `${removeUnderscore(value)} ${MomentTZ().tz(value).format(FormatTimezonePipe._ALIASES[pattern])}`;
  }
}

function isBlank(obj: any): boolean {
  return obj == null || obj === '';
}
