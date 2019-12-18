
import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';
import { RoleModel } from '@core/modules/roles/models';

import { CategoryModel } from './../models/category.model';
import { Job, JobStatus } from './../models/job.model';

export class JobFakeFactory extends FakeModel(Job) {

  constructor(
    public pk: string = faker.random.number().toString(),
    public category: CategoryModel = new CategoryModel({}),
    public role: RoleModel = new RoleModel({}),
    public title: string = faker.random.words(100),
    public start: MomentTZ.Moment = MomentTZ(),
    public status: JobStatus = JobStatus.RUNNING,
    public statusDetail: string = faker.random.words(10),
  ) {
    super(<Job>{
      pk,
      category,
      role,
      title,
      start,
      status,
      statusDetail
    });
  }
}
