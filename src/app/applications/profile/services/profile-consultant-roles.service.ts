import { removeDuplicatesFromArray } from '@shared/utils/array-remove-duplictes';
import { ProjectsRoles } from '@applications/shared/interfaces/projects-roles.interface';

export class ProfileConsultantRolesService {
  roles: Array<string> = [];

  /**
   * get all the roles that the user has taken in all projects he/she has participated
   * @returns {Array<string>}
   */
  getAllRoles( projects: Array<ProjectsRoles> ): Array<string> {
    const allRolesWithRepetition: Array<string> =
      projects ?
        projects
          .map(project => project.roles.map( role => role.name ) )
          .reduce(( a, b ) => a.concat(b), [])
        : [];
    this.roles = removeDuplicatesFromArray(allRolesWithRepetition);

    return this.roles;
  }

}
