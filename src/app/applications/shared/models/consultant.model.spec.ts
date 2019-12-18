import { ConsultantModel } from '.';

import {
  FakeConsultantFactory,
  FakeIndustryFactory,
  FakeSocialNetworkFactory
} from '../faker_factories';
import { socialNetworkType } from './social-network.model';

describe('Model data for consultant', () => {
  let consultant: ConsultantModel;

  beforeEach(() => {
    consultant = new FakeConsultantFactory().modelPropertiesCustom();
  });

  it('has been created =>', () => {
    expect(consultant).toBeTruthy();
  });

  // Industries
  it('has industries =>', () => {
    consultant = new FakeConsultantFactory().modelPropertiesCustom([{
      name: 'industries',
      data: []
    }]);
    expect(consultant.hasIndustries()).toBe(false);
  });

  it('has not industries =>', () => {
    consultant = new FakeConsultantFactory().modelPropertiesCustom([{
      name: 'industries',
      data: [new FakeIndustryFactory()]
    }]);
    expect(consultant.hasIndustries()).toBe(true);
  });

  // Areas Expertise
  it('has expertise =>', () => {
    consultant = new FakeConsultantFactory().modelPropertiesCustom([{
      name: 'areasExpertise',
      data: ['technology']
    }]);
    expect(consultant.hasAreasExpertise()).toBe(true);
  });

  it('has not expertise =>', () => {
    consultant = new FakeConsultantFactory().modelPropertiesCustom([{
      name: 'areasExpertise',
      data: []
    }]);
    expect(consultant.hasAreasExpertise()).toBe(false);
  });

  // Social networks
  it('It gets only pulblic social networks =>', () => {
    const personalWebsite = new FakeSocialNetworkFactory();
    personalWebsite.modelPropertiesCustom([{
      name: 'networkType',
      data: socialNetworkType.website
    }]);
    const skype = new FakeSocialNetworkFactory();
    skype.modelPropertiesCustom([{
      name: 'networkType',
      data: socialNetworkType.skype
    }]);
    consultant = new FakeConsultantFactory().modelPropertiesCustom([{
      name: 'socialNetworks',
      data: [personalWebsite, skype]
    }]);
    expect(consultant.getPublicSocialNetworks(false).length).toEqual(1);
    expect(consultant.getPublicSocialNetworks().length).toEqual(0);
  });

});
