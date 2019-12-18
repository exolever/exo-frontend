import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';
import { TeamModel } from '../models/team.model';
import { Stream } from '../../shared/enums/stream.enum';


export class FakeTeamFactory extends FakeModel ( TeamModel ) {
  public pk: string;
  public name: string;
  public stream: Stream;
  public streamDisplay: string;
  public zoomUrl: string;
  // Manage advisory calls
  public groupUuid: string;

  constructor() {
    super ({
      pk: faker.random.number(100).toString(),
      name: faker.company.companyName(),
      zoomUrl: faker.internet.url(),
      stream: Stream.STREAM_CH_STARTUP,
      groupUuid: faker.lorem.word()
    });
  }

}
