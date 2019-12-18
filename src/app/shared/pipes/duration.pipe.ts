import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert number of seconds in format hh:mm:ss to videos.
 * Example: 90 seconds to 1:30
 */
@Pipe({ name: 'formatDurationTime' })
export class FormatDurationTimePipe implements PipeTransform {

  transform(value: any) {
    const duration = Number(value);

    const h = Math.floor(duration / 3600);
    const m = Math.floor(duration % 3600 / 60);
    const s = Math.floor(duration % 3600 % 60);

    const hDisplay = h > 0 ? h < 10 ? `0${h}:` : `${h}:` : '';
    const mDisplay = m > 0 ? m < 10 ? `0${m}:` : `${m}:` : '00:';
    const sDisplay = s > 0 ? s < 10 ? `0${s}` : s : '00';

    return hDisplay + mDisplay + sDisplay;
  }

}
