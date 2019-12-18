import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';

import { IndustryModel } from '../../shared/models/industry.model';

export class FakeIndustryFactory extends FakeModel ( IndustryModel ) {
  constructor( data?: { name?: string, level?: number } ) {
    const name = data ? data.name ? data.name : faker.lorem.word() : faker.lorem.word();
    const level = data ? data.level ? data.level : faker.random.number( 3 ) : faker.random.number( 3 );

    super( name, level );
  }
}
