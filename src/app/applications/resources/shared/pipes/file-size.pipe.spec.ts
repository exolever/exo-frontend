import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new FileSizePipe();

  it('transforms "52428800" to "50.00 MB"', () => {
    expect(pipe.transform(52428800)).toBe('50.00 MB');
  });

  it('transforms "52428800" to "50 MB"', () => {
    expect(pipe.transform(52428800, 'MB', 0)).toBe('50 MB');
  });

  it('transforms "1073741824" to "1.00000 GB"', () => {
    expect(pipe.transform(1073741824, 'GB', 5)).toBe('1.00000 GB');
  });

  it('transforms "1099511627776" to "1.00 TB"', () => {
    expect(pipe.transform(1099511627776, 'TB')).toBe('1.00 TB');
  });
});
