
import { of as observableOf, Subscription } from 'rxjs';

export class StubMediaService {
  isActive(size: number) { return +size > 1075; }
  asObservable(size: number) { return observableOf(+size > 1075); }
  subscribe() { return new Subscription(); }
}
