import * as faker from 'faker';

import {
  IExOAttribute,
  CH_INTERNAL_EXO_ATTRIBUTE,
  CH_EXTERNAL_EXO_ATTRIBUTE
} from '../interfaces/';


export function FakeIExOAttributeFactory(params: any): IExOAttribute {
  const level = [CH_EXTERNAL_EXO_ATTRIBUTE, CH_INTERNAL_EXO_ATTRIBUTE];
  const exoAttribute: IExOAttribute = {
    name: faker.lorem.word(),
    level: faker.random.number({ 'min': 0, 'max': 5 }),
    type: level[faker.random.number({ 'min': 0, 'max': 1 })],
    pk: faker.random.number().toString()
  };

  // tslint:disable-next-line:no-unused-expression
  params.length !== 0 ? params.map((attr) => exoAttribute[attr.name] = attr.data) : false;

  return exoAttribute;
}
