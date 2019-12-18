import { Observable, of as observableOf} from 'rxjs';
import * as faker from 'faker';

import { PaginationModel } from '@applications/shared/models/pagination.model';
import {FakeConsultantFactory} from '@applications/shared/faker_factories';


export class DirectoryStubService {

  getDirectory(): Observable<PaginationModel<FakeConsultantFactory>> {
    return observableOf(new PaginationModel<FakeConsultantFactory>(
      3,
      `${faker.internet.url()}/?page=2`,
      faker.internet.url(),
      [new FakeConsultantFactory(), new FakeConsultantFactory(), new FakeConsultantFactory()]));
  }
}
