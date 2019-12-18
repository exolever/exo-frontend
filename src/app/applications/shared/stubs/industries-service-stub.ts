import { Observable } from 'rxjs';
import { FakeIndustryFactory } from '../faker_factories/industryFake.model';

export class StubIndustriesService {
  getIndustries(): Observable<Array<FakeIndustryFactory>> {
    return Observable.create(() => [new FakeIndustryFactory()]);
  }
}
