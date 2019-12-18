import * as MomentTZ from 'moment-timezone';
const dateFormat = 'MM/DD/YYYY';

/**
 * @param {Date} date
 * @param {Date} time
 * @param {string} timezone
 * @param {string} mask Mask is a format to convert date. By default will be MM/DD/YYYY.
 */
export function convertResultToMoment(date: Date, time: Date, timezone: string, mask = dateFormat): MomentTZ.Moment {
  const dateString = formatDate(date, mask);
  const timeString = time.toLocaleTimeString();
  const datetimeString = dateString.concat(' ').concat(timeString);
  return MomentTZ.tz(datetimeString, `${mask} h:mm:ss A`, timezone);
}

export function formatDate(date, mask) {
  return MomentTZ(date).format(mask);
}

export function convertDateToString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
