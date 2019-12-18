import { convertResultToMoment, convertDateToString } from './md2Datepicker.helper';

describe('Convert result of md2 datepicker to moment', () => {

  it('Should return correct value', () => {
    const dateValue = new Date ('Tue Oct 24 2017 02:00:00 GMT+0200 (CEST)'); // 2017-10-24
    const timeValue = new Date('Mon Oct 09 2017 19:00:25 GMT+0200 (CEST)'); // 19:00
    const timezone = 'America/Mexico_City'; // +05:00
    const momentResult = convertResultToMoment(dateValue, timeValue, timezone);
    expect(momentResult.format('YYYY-MM-DD HH:mm')).toEqual('2017-10-24 19:00');
    expect(momentResult.toISOString()).toEqual('2017-10-25T00:00:25.000Z'); // 2017-10-24 19:00+05:00 = 2017-10-25 00:00
  });

  it('Should convert Date to String', () => {
    const dateValue = new Date ('2018-10-19');
    expect(convertDateToString(dateValue)).toEqual('2018-10-19');
  });

});
