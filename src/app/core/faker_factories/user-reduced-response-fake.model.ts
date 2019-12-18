import * as faker from 'faker';

export class UserReducedResponseFakeModel {
  pk = faker.random.number( { min: 1, max: 13 } ).toString();
  fullName = faker.name.findName();
  shortName = faker.name.firstName();
  slug = faker.random.word();
  profilePictures = [{ height: faker.random.number(), width: faker.random.number(), url: faker.internet.url() }];
}
