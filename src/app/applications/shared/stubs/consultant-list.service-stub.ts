import { of as observableOf } from 'rxjs';


import { FakeConsultantFactory } from '../faker_factories/consultant-fake.model';

export class StubConsultantListService {
  getConsultants() { return observableOf([new FakeConsultantFactory()]); }
}
