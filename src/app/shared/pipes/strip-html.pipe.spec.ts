import { StripHtmlPipe } from './strip-html.pipe';

describe ('StripHtmlPipe', () => {
  const pipe = new StripHtmlPipe();

  it('transforms removing html tags', () => {
    expect(pipe.transform('<p>Hello world</p>'))
      .toEqual('Hello world');
    expect(pipe.transform('<ul><li>First</li></ul>'))
      .toEqual('First');
  });
});
