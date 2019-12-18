import { FakeProjectFactory } from '../faker_factories/projectFake.model';
import { BehaviorSubject } from 'rxjs';

export class ProjectServiceStub {
  public project$ = new BehaviorSubject(new FakeProjectFactory());
  getProjectService() {
    return new FakeProjectFactory(2, 2);
  }
}
