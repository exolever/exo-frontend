import * as MomentTZ from 'moment-timezone';

import { LANGUAGES_CONF } from '@app/app-config';

import { FormatDatePipe } from './format-date.pipe';

describe('FormatDatePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new FormatDatePipe();
  const currentYear = new Date().getFullYear();
  const exoLanguage = localStorage.getItem(LANGUAGES_CONF.KEY_LOCALSTORAGE);

  afterAll(() => {
    // Set the old 'exo-language' item to prevent affect other tests.
    localStorage.setItem(LANGUAGES_CONF.KEY_LOCALSTORAGE, exoLanguage);
  });

  it('transforms "' + currentYear + '-10-15" moment to "15 Oct"', () => {
    const mmt = MomentTZ(currentYear + '-10-15');
    expect(pipe.transform(mmt, 'short')).toBe('15 Oct');
  });

  it('transforms "' + (currentYear + 1)  + '-10-15" moment to "15 Oct ' + (currentYear + 1)  + '"', () => {
    const mmt = MomentTZ((currentYear + 1) + '-10-15');
    expect(pipe.transform(mmt, 'short')).toBe('15 Oct ' + (currentYear + 1));
  });

  it('transforms "' + currentYear + '-10-15" moment to "ddd, 15 Oct"', () => {
    const mmt = MomentTZ(currentYear + '-10-15');
    expect(pipe.transform(mmt, 'medium')).toBe(mmt.format('ddd') + ', 15 Oct');
  });

  it('transforms "' + currentYear + '-10-15 17:00 (Europe/Madrid)" moment to "ddd, 15 Oct - 17:00 (CEST)"', () => {
    const mmt = MomentTZ(currentYear + '-10-15 17:00').tz('Europe/Madrid');
    expect(pipe.transform(mmt, 'long')).toBe(mmt.format('ddd') + ', 15 Oct - 17:00 (CEST)');
  });

  it('transforms "' + currentYear + '-10-15 17:00 (America/Sao_Paulo)" moment to "ddd, 15 Oct - 12:00 ' +
    '(GMT-03)"', () => {
    const mmt = MomentTZ(currentYear + '-10-15 17:00').tz('America/Sao_Paulo');
    expect(pipe.transform(mmt, 'long')).toBe(mmt.format('ddd') + ', 15 Oct - 12:00 (GMT-03)');
  });

  it('transforms "' + currentYear + '-10-15 17:00 (America/Sao_Paulo)" moment to "ddd, 15 Oct', () => {
    const mmt = MomentTZ(currentYear + '-10-15 17:00').tz('America/Sao_Paulo');
    expect(pipe.transform(mmt, 'medium')).toBe(mmt.format('ddd') + ', 15 Oct');
  });
});
