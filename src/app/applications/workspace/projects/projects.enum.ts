export enum StatusProjectEnum {
  DRAFT = 'D',
  WAITING = 'W',
  STARTED = 'S',
  FINISHED = 'F'
}
export enum StreamProjectEnum {
  CORE = 'C',
  EDGE = 'E'
}

export enum CertificationProjectEnum {
  CONSULTANT = 'EC',
  SPRINT_COACH = 'X',
  FOUNDATIONS = 'EF',
  TRAINER = 'TR'
}

export enum ProjectActionsEnum {
  EDIT = 'E',
  PUBLISH = 'L',
  START = 'S',
  FINISH = 'F',
  DELETE = 'D'
}

export enum ProjectMemberActionsEnum {
  EDIT_USER_DATA_FOR_PARTICIPANT = 'E', // If user is not exists, his data can be edited
  EDIT_TEAM_FOR_PARTICIPANT = 'T', // When the user exists only can edit the team belong to
  EDIT_COLLABORATOR = 'R',
  DELETE_MEMBER = 'S',
  TEAM_MOVE = 'V'
}

export enum TeamActionsEnum {
  EDIT = 'E',
  DELETE = 'D',
  PARTICIPANTS = 'P',
  USER_TEAM_EDIT_PARTICIPANT = 'E',
  USER_TEAM_EDIT_ROLES = 'R',
  USER_TEAM_EDIT_TEAMS = 'T',
  USER_TEAM_UNSELECT = 'S',
}


export enum ZoneEnum {
  BACKOFFICE = 'B',
  PROJECT = 'P',
  PROFILE = 'F',
}
