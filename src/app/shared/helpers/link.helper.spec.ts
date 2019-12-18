import { addHttpToLink } from './link.helper';

describe('Link helpers', () => {

  it('add httpToLink =>', () => {
    expect(addHttpToLink('www.google.es')).toEqual('http://www.google.es');
    expect(addHttpToLink('http://www.google.es')).toEqual('http://www.google.es');
    expect(addHttpToLink('https://www.google.es')).toEqual('https://www.google.es');
  });

});
