import { socialNetworkType } from '../models/social-network.model';
import { getSocialNetworkType } from './social-network.helpers';

describe('Social Network helpers', () => {

  it('add httpToLink =>', () => {
    expect(getSocialNetworkType('http://facebook.suki.es')).toEqual(socialNetworkType.facebook);
    expect(getSocialNetworkType('facebook.suki.es')).toEqual(socialNetworkType.facebook);
    expect(getSocialNetworkType('http://sdf.facebook')).toEqual(socialNetworkType.facebook);
    expect(getSocialNetworkType('http://medium.suki.es')).toEqual(socialNetworkType.medium);
    expect(getSocialNetworkType('http://skype.suki.es')).toEqual(socialNetworkType.skype);
    expect(getSocialNetworkType('http://twitter.suki.es')).toEqual(socialNetworkType.twitter);
    expect(getSocialNetworkType('http://linkedin.suki.es')).toEqual(socialNetworkType.linkedin);
    expect(getSocialNetworkType('http://other.suki.es')).toEqual(socialNetworkType.personalLink);

    expect(getSocialNetworkType('')).toBeUndefined();

  });

});
