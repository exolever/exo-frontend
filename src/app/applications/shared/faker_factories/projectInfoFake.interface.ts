import * as faker from 'faker';

import { IProjectRole } from '../interfaces/project-info.interface';


export function FakeIProjectRoleFactory(
  params?: { status?: number, name?: string, roleCode?: string, roleName?: string }
  ): IProjectRole {
  const status = params ? params.status ? params.status : faker.random.number( 3 ) : faker.random.number( 3 );
  const name = params ? params.name ? params.name : faker.lorem.word() : faker.lorem.word();
  const roleCode =
    params ?
      params.roleCode ? params.roleCode : faker.random.word()[0].toUpperCase() : faker.random.word()[0].toUpperCase();
  const roleName = params ? params.roleName ? params.roleName : faker.lorem.word() : faker.lorem.word();

  return { status: status, name: name, roleCode: roleCode, roleName: roleName };
}
