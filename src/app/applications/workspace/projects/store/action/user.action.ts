import { Action } from '@ngrx/store';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ProjectMember } from '../../models/project-member.model';

export enum TypeActionEnum {
  LOAD =                '[Workspace - Project - users] Load',
  LOAD_SUCCESS =        '[Workspace - Project - users] Load success',
  LOAD_FAIL =           '[Workspace - Project - users] Load fail',
  LOAD_DETAIL =         '[Workspace - Project - users] Load details',
  LOAD_DETAIL_SUCCESS = '[Workspace - Project - users] Load details success',
  LOAD_DETAIL_FAIL =    '[Workspace - Project - users] Load details fail',
  CREATE_COLLABORATOR =             '[Workspace - Project - users-collaborator] Create collaborator',
  CREATE_COLLABORATOR_SUCCESS =     '[Workspace - Project - users-collaborator] Create collaborator success',
  CREATE_COLLABORATOR_FAIL =        '[Workspace - Project - users-collaborator] Create collaborator fail',
  CREATE_PARTICIPANT =              '[Workspace - Project - users-participant] Create participant',
  CREATE_PARTICIPANT_SUCCESS =      '[Workspace - Project - users-participant] Create participant success',
  CREATE_PARTICIPANT_FAIL =         '[Workspace - Project - users-participant] Create participant fail',
  EDIT_COLLABORATOR =               '[Workspace - Project - users-collaborator] Edit collaborator',
  EDIT_COLLABORATOR_SUCCESS =       '[Workspace - Project - users-collaborator] Edit collaborator success',
  EDIT_COLLABORATOR_FAIL =          '[Workspace - Project - users-collaborator] Edit collaborator fail',
  EDIT_PARTICIPANT =                '[Workspace - Project - users-participant] Edit participant',
  EDIT_PARTICIPANT_SUCCESS =        '[Workspace - Project - users-participant] Edit participant success',
  EDIT_PARTICIPANT_FAIL =           '[Workspace - Project - users-participant] Edit participant fail',
  EDIT_PARTICIPANT_TEAMS =          '[Workspace - Project - users-participant - teams] Edit teams participant',
  EDIT_PARTICIPANT_TEAMS_SUCCESS =  '[Workspace - Project - users-participant - teams] Edit teams participant success',
  EDIT_PARTICIPANT_TEAMS_FAIL =     '[Workspace - Project - users-participant - teams] Edit teamsparticipant fail',
  DELETE =              '[Workspace - Project - users] Delete',
  DELETE_SUCCESS =      '[Workspace - Project - users] Delete success',
  DELETE_FAIL =         '[Workspace - Project - users] Delete fail',
  SEARCH =              '[Workspace - Project - users] Set Search',
  SET_PAGINATION =      '[Workspace - Project - users] Set pagination params',
}

export class Load implements Action {
  readonly type = TypeActionEnum.LOAD;
  constructor(public payload: number) {}
}

export class LoadSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_SUCCESS;
  constructor(public payload: Pagination<ProjectMember>) { }
}

export class LoadFail implements Action {
  readonly type = TypeActionEnum.LOAD_FAIL;
  constructor(public payload: any) { }
}
export class LoadDetails implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL;
  constructor(public payload: number) {}
}

export class LoadDetailsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL_SUCCESS;
  constructor(public payload: ProjectMember) {}
}

export class LoadDetailsFail implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL_FAIL;
  constructor(public payload: any) { }
}

export class CreateCollaborator implements Action {
  readonly type = TypeActionEnum.CREATE_COLLABORATOR;
  constructor(public payload: {
    data: {projectRoles: number[], teams: number[]},
    projectPk: number
  }) {}
}

export class CreateCollaboratorSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_COLLABORATOR_SUCCESS;
  constructor(public payload: ProjectMember) { }
}

export class CreateCollaboratorFail implements Action {
  readonly type = TypeActionEnum.CREATE_COLLABORATOR_FAIL;
  constructor(public payload: any) { }
}

export class EditCollaborator implements Action {
  readonly type = TypeActionEnum.EDIT_COLLABORATOR;
  constructor(public payload: {
    data: {projectRoles: number[], teams: number[]},
    projectPk: number,
    userUuid: string,
  }) {}
}

export class EditCollaboratorSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_COLLABORATOR_SUCCESS;
  constructor(public payload: ProjectMember) { }
}

export class EditCollaboratorFail implements Action {
  readonly type = TypeActionEnum.EDIT_COLLABORATOR_FAIL;
  constructor(public payload: any) { }
}

export class CreateParticipant implements Action {
  readonly type = TypeActionEnum.CREATE_PARTICIPANT;
  constructor(public payload: {
    data: {name: string, email: string, teams: number[]},
    projectPk: number
  }) {}
}

export class CreateParticipantSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_PARTICIPANT_SUCCESS;
  constructor(public payload: ProjectMember) { }
}

export class CreateParticipantFail implements Action {
  readonly type = TypeActionEnum.CREATE_PARTICIPANT_FAIL;
  constructor(public payload: any) { }
}

export class EditParticipant implements Action {
  readonly type = TypeActionEnum.EDIT_PARTICIPANT;
  constructor(public payload: {
    data: {name: string, email: string, teams: number[]},
    projectPk: number,
    userUuid: string,
  }) {}
}

export class EditParticipantSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_PARTICIPANT_SUCCESS;
  constructor(public payload: ProjectMember) { }
}

export class EditParticipantFail implements Action {
  readonly type = TypeActionEnum.EDIT_PARTICIPANT_FAIL;
  constructor(public payload: any) { }
}

export class EditParticipantTeams implements Action {
  readonly type = TypeActionEnum.EDIT_PARTICIPANT_TEAMS;
  constructor(public payload: {
    data: {teams: number[]},
    projectPk: number,
    userUuid: string,
  }) {}
}

export class EditParticipantTeamsSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_PARTICIPANT_TEAMS_SUCCESS;
  constructor(public payload: ProjectMember) { }
}

export class EditParticipantTeamsFail implements Action {
  readonly type = TypeActionEnum.EDIT_PARTICIPANT_TEAMS_FAIL;
  constructor(public payload: any) { }
}


export class Delete implements Action {
  readonly type = TypeActionEnum.DELETE;
  constructor(public payload: {projectPk: number, member: ProjectMember}) {}
}

export class DeleteSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_SUCCESS;
  constructor(public payload: string) { }
}

export class DeleteFail implements Action {
  readonly type = TypeActionEnum.DELETE_FAIL;
  constructor(public payload: any) { }
}

export class SetSearch implements Action {
  readonly type = TypeActionEnum.SEARCH;
  constructor(public payload: {projectPk: number, searchBy: string}) {}
}

export class SetPagination implements Action {
  readonly type = TypeActionEnum.SET_PAGINATION;
  constructor(public payload: {projectPk: number; pageIndex: number; pageSize: number}) {}
}

export type All
  = Load
  | LoadSuccess
  | LoadFail
  | CreateCollaborator
  | CreateCollaboratorSuccess
  | CreateCollaboratorFail
  | EditCollaborator
  | EditCollaboratorSuccess
  | EditCollaboratorFail
  | CreateParticipant
  | CreateParticipantSuccess
  | CreateParticipantFail
  | EditParticipant
  | EditParticipantSuccess
  | EditParticipantFail
  | EditParticipantTeams
  | EditParticipantTeamsSuccess
  | EditParticipantTeamsFail
  | Delete
  | DeleteSuccess
  | DeleteFail
  | LoadDetails
  | LoadDetailsSuccess
  | LoadDetailsFail
  | SetSearch
  | SetPagination
;
