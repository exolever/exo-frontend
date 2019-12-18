export class ServiceGraphResponseInterface {
  pk: string;
  uuid?: string;
  name: string;
  typeProject: string;
  location: string;
  timezone: string;
  template: string;
  consultantsRoles: Array<ConsultantsRolesResponseInterface>;
  usersRoles: Array<ParticipantsRolesResponseInterface>;
  customer: { name: string };
  hasSwarmSession: boolean;
  myTeams: Array<{ pk: string }>;
  nextUrl: string;
  settings: string;
  steps: Array<{ pk: string }>;
}

interface ConsultantsRolesResponseInterface {
  consultant: {
    user: { pk:  string }
  };
  exoRole: {
    code: string;
    name: string;
  };
}

interface ParticipantsRolesResponseInterface {
  user: { pk:  string };
  exoRole: {
    code: string;
    name: string;
  };
}
