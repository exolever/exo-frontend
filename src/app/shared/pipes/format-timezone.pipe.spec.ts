import * as MomentTZ from 'moment-timezone';

import { FormatTimezonePipe } from './format-timezone.pipe';
import { removeUnderscore } from '@shared/helpers/string.helper';

describe('FormatTimezonePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new FormatTimezonePipe();

  it('transforms "Asia/Dubai" to "Asia/Dubai +04"', () => {
    expect(pipe.transform('Asia/Dubai')).toBe('Asia/Dubai +04');
  });

  it('transforms "Asia/Dubai" to "Asia/Dubai UTC+04:00 (+04)"', () => {
    expect(pipe.transform('Asia/Dubai', 'long')).toBe('Asia/Dubai UTC+04:00 (+04)');
  });

  it('transforms "Europe/Madrid" to "Europe/Madrid CET"', () => {
    expect(pipe.transform('Europe/Madrid', 'short'))
      .toBe(`${removeUnderscore('Europe/Madrid')} ${MomentTZ().tz('Europe/Madrid')
        .format(FormatTimezonePipe._ALIASES['short'])}`
      );
  });

  it('transforms "Europe/Madrid" to "Europe/Madrid UTC+01:00 (CET)"', () => {
    expect(pipe.transform('Europe/Madrid', 'long'))
      .toBe(`${removeUnderscore('Europe/Madrid')} ${MomentTZ().tz('Europe/Madrid')
        .format(FormatTimezonePipe._ALIASES['long'])}`);
  });

});
