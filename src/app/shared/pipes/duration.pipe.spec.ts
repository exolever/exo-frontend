import { FormatDurationTimePipe } from './duration.pipe';

describe('DurationPipe', () => {
  const pipe = new FormatDurationTimePipe();

  it ('should transform 110 seconds to 01:50', () => {
    expect(pipe.transform(110)).toEqual('01:50');
  });

  it ('should transform 61 seconds to 01:01', () => {
    expect(pipe.transform(61)).toEqual('01:01');
  });

  it ('should transform 291 seconds to 04:51', () => {
    expect(pipe.transform(291)).toEqual('04:51');
  });

  it ('should transform 3690 seconds to 01:01:30', () => {
    expect(pipe.transform(3690)).toEqual('01:01:30');
  });

  it ('shouldn\'t return negative values', () => {
    expect(pipe.transform(-54)).toEqual('00:00');
  });
});
