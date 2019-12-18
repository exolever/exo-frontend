import { ReplacePipe } from '@shared/pipes/replace.pipe';

describe('', () => {
  const pipe = new ReplacePipe();

  it('transforms LOCAL_TEAM_MEMBER to LOCAL TEAM MEMBER', () => {
    expect(pipe.transform('LOCAL_TEAM_MEMBER', '_', ' '))
      .toBe('LOCAL TEAM MEMBER');
  });

  it('transforms SEARCH_TRUE to SEARCH TRUE', () => {
    const regex = new RegExp('_', 'gi');
    expect(pipe.transform('SEARCH_TRUE', regex, ' '))
      .toBe('SEARCH TRUE');
  });

  it('transforms Xmas to Christmas', () => {
    expect(pipe.transform('the night before Xmas...', 'xmas', 'Christmas'))
      .toBe('the night before Christmas...');
  });

  it('wrong data for replace', () => {
    expect(pipe.transform('', ' ', '-')).toBe('');
    expect(pipe.transform(null, ' ', '-')).toBe('');
    expect(pipe.transform(undefined, ' ', '-')).toBe('');
  });
});
