
import { ProjectModel } from './project.model';
import { FakeProjectFactory } from '../faker_factories';

describe('Project model', () => {
  const fakeProject = new FakeProjectFactory();
  let project: ProjectModel;

  beforeEach(() => {
    project = fakeProject.modelPropertiesCustom();
  });

  it ( 'should generate model', () => {
    expect ( project ).toBeTruthy();
  });

});
