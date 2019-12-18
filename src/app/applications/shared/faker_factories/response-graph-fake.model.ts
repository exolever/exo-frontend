import * as faker from 'faker';
import { FakeModel } from '@shared/faker_factories';

import { ResponseGraph } from '../models';


export class FakeResponseGraph extends FakeModel ( ResponseGraph ) {
  public responseData: Array<any> = [];

  constructor(fakeModelResponse?: any, totalCount: number = 3) {
    super();
    this.startCursor = faker.random.uuid();
    this.endCursor = faker.random.uuid();
    this.hasNextPage = true;
    this.hasPreviousPage = true;
    this.totalCount = totalCount;

    for (let i = totalCount; i >= 1; i--) {
      this.responseData.push(new fakeModelResponse());
    }
  }

}
