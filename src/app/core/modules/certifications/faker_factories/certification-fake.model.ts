
import * as faker from 'faker';

import { CertificationEnum } from '../enums';

export class CertificationFakeModel {
  code = faker.random.arrayElement(Object.keys(CertificationEnum));
  name = faker.lorem.words(13);
  description = faker.lorem.words(100);
  level = faker.random.number({ min: 0, max: 2 });
}
