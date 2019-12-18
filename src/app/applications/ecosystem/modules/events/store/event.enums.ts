export enum TypeEventEnum {
  WORKSHOP = 'WO',
  TALK = 'TA',
  SUMMIT = 'SU',
  OTHER = 'OT'
}

export enum FollowTypeEnum {
  INPERSON = 'P',
  STREAMING = 'S',
  VIRTUAL = 'V'
}

export enum StatusTypeEnum {
  PENDING = 'P',
  PUBLIC = 'H',
  DELETED = 'D',
  REJECTED = 'R'
}

export enum RoleMember {
  SPEAKER_SUMMIT = 'SUS',
  SPEAKER_OTHER = 'OSP',
  SPEAKER_TALK = 'TAS',
  SPEAKER_WORKSHOP = 'WSP',
  ORGANIZER = 'SUO',
  PARTICIPANT = 'CSC',
  COLLABORATOR = 'SUC',
  FACILITATOR = 'SUF'
}
