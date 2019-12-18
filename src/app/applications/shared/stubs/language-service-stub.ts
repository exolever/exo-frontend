import { Observable } from 'rxjs';

export class StubLanguageService {
  getLanguages() { return Observable.create(() => []); }
}
