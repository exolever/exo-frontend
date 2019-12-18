import { Observable } from 'rxjs';

export class StubLocationService {
  getCountries() { return Observable.create(() => []); }
}
