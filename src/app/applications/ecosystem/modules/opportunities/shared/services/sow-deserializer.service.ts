import { Injectable } from '@angular/core';

import * as MomentTZ from 'moment-timezone';

import { removeUnderscore } from '@shared/helpers/string.helper';

import { SowInterface } from '../../models/opportunity.interface';

@Injectable()
export class SowDeserializerService {

  deserialize(data: any): SowInterface {
    const sow = new SowInterface(data);
    if (data.startDate) {
      sow.startDate = MomentTZ.tz(data.startDate, 'YYYY-MM-DD', 'UTC');
    }
    if (data.timezone) {
      sow.timeZone = removeUnderscore(data.timezone);
    }
    // TODO: manage 'YYYY-MM-DD HH:mm:ssh' as a global configuration
    if (data.startTime) {
      sow.startTime = MomentTZ.tz(
        `${data.startDate} ${data.startTime}`,
        'YYYY-MM-DD HH:mm:ssh', 'UTC');
    }
    if (data.endDate) {
      sow.endDate = MomentTZ.tz(data.endDate, 'YYYY-MM-DD', 'UTC');
    }
    sow.duration = data.durationValue;
    sow.durationUnit = data.durationUnity;
    return sow;
  }
}
