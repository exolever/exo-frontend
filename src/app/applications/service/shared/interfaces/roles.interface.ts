/** consultants related to service */
export interface UsersServiceRoles {
  userPk: string;
  consultantPk?: string;
  roleCode?: string;
  roleName?: string;
}
export interface RolesWithUsersInterface {
  consultantsRoles: UsersServiceRoles[];
  usersRoles: UsersServiceRoles[];
}
