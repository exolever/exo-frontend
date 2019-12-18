// TODO move this to the the badge part
enum CommunityRoleEnum {
  COMMUNITY_BUILDER = <any>'CCB',
  CONTENT_CREATOR = <any>'CCC'
}

namespace CommunityRoleEnum {
  export function toString(role: CommunityRoleEnum): string {
    switch (role) {
      case CommunityRoleEnum.COMMUNITY_BUILDER:
        return 'Community Builder';
      case CommunityRoleEnum.CONTENT_CREATOR:
        return 'Content Creator';
    }
  }
}

enum AdvisorCallRoleEnum {
  ADVISOR_CALL = <any>'ACA'
}

namespace AdvisorCallRoleEnum {
  export function toString(role: AdvisorCallRoleEnum): string {
    switch (role) {
      case AdvisorCallRoleEnum.ADVISOR_CALL:
        return 'Advisor';
    }
  }
}

enum CertificationProgramRoleEnum {
  ADVISOR_CP = <any>'CAD',
  DISRUPTOR_CP = <any>'CDI',
  MASTER_TRAINER_CP = <any>'CMT',
  MENTOR_COACH_CP = <any>'CMC'
}

namespace CertificationProgramRoleEnum {
  export function toString(role: CertificationProgramRoleEnum): string {
    switch (role) {
      case CertificationProgramRoleEnum.ADVISOR_CP:
        return 'Advisor';
      case CertificationProgramRoleEnum.DISRUPTOR_CP:
        return 'Disruptor';
      case CertificationProgramRoleEnum.MASTER_TRAINER_CP:
        return 'Master Trainer';
      case CertificationProgramRoleEnum.MENTOR_COACH_CP:
        return 'Mentor Coach';
    }
  }
}

enum DisruptionSessionRoleEnum {
  DISRUPTOR_SESSION = <any>'DSD'
}

namespace DisruptionSessionRoleEnum {
  export function toString(role: DisruptionSessionRoleEnum): string {
    switch (role) {
      case DisruptionSessionRoleEnum.DISRUPTOR_SESSION:
        return 'Disruptor';
    }
  }
}

enum SprintRoleEnum {
  ACCOUNT_MANAGER_SPRINT = <any>'SAM',
  ADVISOR_SPRINT = <any>'SAD',
  ALIGN_TRAINER_SPRINT = <any>'SAT',
  AWAKE_SPEAKER_SPRINT = <any>'SAS',
  DELIVERY_MANAGER_SPRINT = <any>'SDM',
  DISRUPTOR_SPRINT = <any>'SDI',
  DISRUPTOR_SPEAKER_SPRINT = <any>'SDS',
  HEAD_COACH_SPRINT = <any>'SHC',
  OBSERVER_SPRINT = <any>'SOB',
  OTHER_SPRINT = <any>'SOT',
  REPORTER_SPRINT = <any>'SRE',
  SHADOW_COACH_SPRINT = <any>'SSC',
  SPRINT_COACH_SPRINT = <any>'SSH',
  SPRINT_CONTRIBUTOR_SPRINT = <any>'SCO',
  SPRINT_PARTICIPANT_SPRINT = <any>'SPA'
}


namespace SprintRoleEnum {
  export function toString(role: SprintRoleEnum): string {
    switch (role) {
      case SprintRoleEnum.ACCOUNT_MANAGER_SPRINT:
        return 'Account Manager';
      case SprintRoleEnum.ADVISOR_SPRINT:
        return 'Advisor';
      case SprintRoleEnum.ALIGN_TRAINER_SPRINT:
        return 'Align Trainer';
      case SprintRoleEnum.AWAKE_SPEAKER_SPRINT:
        return 'Awake Speaker';
      case SprintRoleEnum.DELIVERY_MANAGER_SPRINT:
        return 'Delivery Manager';
      case SprintRoleEnum.DISRUPTOR_SPRINT:
        return 'Disruptor';
      case SprintRoleEnum.DISRUPTOR_SPEAKER_SPRINT:
        return 'Disruptor Speaker';
      case SprintRoleEnum.HEAD_COACH_SPRINT:
        return 'Head Coach';
      case SprintRoleEnum.OBSERVER_SPRINT:
        return 'Observer';
      case SprintRoleEnum.OTHER_SPRINT:
        return 'Other';
      case SprintRoleEnum.REPORTER_SPRINT:
        return 'Reporter';
      case SprintRoleEnum.SHADOW_COACH_SPRINT:
        return 'Shadow Coach';
      case SprintRoleEnum.SPRINT_COACH_SPRINT:
        return 'Sprint Coach';
      case SprintRoleEnum.SPRINT_CONTRIBUTOR_SPRINT:
        return 'Sprint Contributor';
      case SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT:
        return 'Sprint Participant';
    }
  }
}

enum FastrackRoleEnum {
  CO_CURATOR_FT = <any>'FCC',
  CURATOR_FT = <any>'FCU',
  LOCAL_TEAM_MEMBER_FT = <any>'FLM',
  OBSERVER_EVALUATOR_FT = <any>'FOE',
  SOLUTION_ACCELERATOR_FT = <any>'FSA',
  TEAM_LEADER_FT = <any>'FTL',
  TEAM_MEMBER_FT = <any>'FTM'
}

namespace FastrackRoleEnum {
  export function toString(role: FastrackRoleEnum): string {
    switch (role) {
      case FastrackRoleEnum.CO_CURATOR_FT:
        return 'Co-Curator';
      case FastrackRoleEnum.CURATOR_FT:
        return 'Curator';
      case FastrackRoleEnum.LOCAL_TEAM_MEMBER_FT:
        return 'Local Team Member';
      case FastrackRoleEnum.OBSERVER_EVALUATOR_FT:
        return 'Observer/Evaluator';
      case FastrackRoleEnum.SOLUTION_ACCELERATOR_FT:
        return 'Solution Accelerator';
      case FastrackRoleEnum.TEAM_LEADER_FT:
        return 'Team Leader';
      case FastrackRoleEnum.TEAM_MEMBER_FT:
        return 'Team Member';
    }
  }
}

enum OtherRoleEnum {
  ADVISOR_OTHER = <any>'OAD',
  COACH_OTHER = <any>'OCO',
  CONSULTANT_OTHER = <any>'OCN',
  DISRUPTOR_OTHER = <any>'ODR',
  OTHER_OTHER = <any>'OOO',
  SPEAKER_OTHER = <any>'OSP',
  TRAINER_OTHER = <any>'OTR'
}

namespace OtherRoleEnum {
  export function toString(role: OtherRoleEnum): string {
    switch (role) {
      case OtherRoleEnum.ADVISOR_OTHER:
        return 'Advisor';
      case OtherRoleEnum.COACH_OTHER:
        return 'Coach';
      case OtherRoleEnum.CONSULTANT_OTHER:
        return 'Consultant';
      case OtherRoleEnum.DISRUPTOR_OTHER:
        return 'Disruptor';
      case OtherRoleEnum.OTHER_OTHER:
        return 'Other';
      case OtherRoleEnum.SPEAKER_OTHER:
        return 'Speaker';
      case OtherRoleEnum.TRAINER_OTHER:
        return 'Trainer';
    }
  }
}

enum SummitRoleEnum {
  COLLABORATOR_SUMMIT = <any>'SUC',
  FACILITATOR_SUMMIT = <any>'SUF',
  ORGANIZER_SUMMIT = <any>'SUO',
  SPEAKER_SUMMIT = <any>'SUS',
  COACH_SUMMIT = <any>'SUH'
}

namespace SummitRoleEnum {
  export function toString(role: SummitRoleEnum): string {
    switch (role) {
      case SummitRoleEnum.COLLABORATOR_SUMMIT:
        return 'Collaborator';
      case SummitRoleEnum.FACILITATOR_SUMMIT:
        return 'Facilitator';
      case SummitRoleEnum.ORGANIZER_SUMMIT:
        return 'Organizer';
      case SummitRoleEnum.SPEAKER_SUMMIT:
        return 'Speaker';
      case SummitRoleEnum.COACH_SUMMIT:
        return 'Coach';
    }
  }
}

enum SwarmRoleEnum {
  ADVISOR_SWARM = <any>'SWA'
}

namespace SwarmRoleEnum {
  export function toString(role: SwarmRoleEnum): string {
    switch (role) {
      case SwarmRoleEnum.ADVISOR_SWARM:
        return 'Advisor';
    }
  }
}

enum KeynotePresentationRoleEnum {
  SPEAKER_KEYNOTE_PRESENTATION = <any>'TAS'
}

namespace KeynotePresentationRoleEnum {
  export function toString(role: KeynotePresentationRoleEnum): string {
    switch (role) {
      case KeynotePresentationRoleEnum.SPEAKER_KEYNOTE_PRESENTATION:
        return 'Speaker';
    }
  }
}

enum WorkshopRoleEnum {
  SPEAKER_WS = <any>'WSP',
  TRAINER_WS = <any>'WTR'
}

namespace WorkshopRoleEnum {
  export function toString(role: WorkshopRoleEnum): string {
    switch (role) {
      case WorkshopRoleEnum.SPEAKER_WS:
        return 'Speaker';
      case WorkshopRoleEnum.TRAINER_WS:
        return 'Trainer';
    }
  }
}

type RoleEnum =
  CommunityRoleEnum |
  AdvisorCallRoleEnum |
  CertificationProgramRoleEnum |
  DisruptionSessionRoleEnum |
  SprintRoleEnum |
  FastrackRoleEnum |
  OtherRoleEnum |
  SummitRoleEnum |
  SwarmRoleEnum |
  KeynotePresentationRoleEnum |
  WorkshopRoleEnum;

namespace RoleEnum {
  export const enums = {
    ...CommunityRoleEnum,
    ...AdvisorCallRoleEnum,
    ...CertificationProgramRoleEnum,
    ...DisruptionSessionRoleEnum,
    ...SprintRoleEnum,
    ...FastrackRoleEnum,
    ...OtherRoleEnum,
    ...SummitRoleEnum,
    ...SwarmRoleEnum,
    ...KeynotePresentationRoleEnum,
    ...WorkshopRoleEnum,
  };
  export function toString(role: RoleEnum): string {
    switch (role) {
      case CommunityRoleEnum.COMMUNITY_BUILDER:
      case CommunityRoleEnum.CONTENT_CREATOR:
        return CommunityRoleEnum.toString(role);
      case AdvisorCallRoleEnum.ADVISOR_CALL:
        return AdvisorCallRoleEnum.toString(role);
      case CertificationProgramRoleEnum.ADVISOR_CP:
      case CertificationProgramRoleEnum.DISRUPTOR_CP:
      case CertificationProgramRoleEnum.MASTER_TRAINER_CP:
      case CertificationProgramRoleEnum.MENTOR_COACH_CP:
        return CertificationProgramRoleEnum.toString(role);
      case DisruptionSessionRoleEnum.DISRUPTOR_SESSION:
        return DisruptionSessionRoleEnum.toString(role);
      case SprintRoleEnum.ACCOUNT_MANAGER_SPRINT:
      case SprintRoleEnum.ADVISOR_SPRINT:
      case SprintRoleEnum.ALIGN_TRAINER_SPRINT:
      case SprintRoleEnum.AWAKE_SPEAKER_SPRINT:
      case SprintRoleEnum.DELIVERY_MANAGER_SPRINT:
      case SprintRoleEnum.DISRUPTOR_SPRINT:
      case SprintRoleEnum.DISRUPTOR_SPEAKER_SPRINT:
      case SprintRoleEnum.HEAD_COACH_SPRINT:
      case SprintRoleEnum.OBSERVER_SPRINT:
      case SprintRoleEnum.OTHER_SPRINT:
      case SprintRoleEnum.REPORTER_SPRINT:
      case SprintRoleEnum.SHADOW_COACH_SPRINT:
      case SprintRoleEnum.SPRINT_COACH_SPRINT:
      case SprintRoleEnum.SPRINT_CONTRIBUTOR_SPRINT:
      case SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT:
        return SprintRoleEnum.toString(role);
      case SummitRoleEnum.COLLABORATOR_SUMMIT:
      case SummitRoleEnum.FACILITATOR_SUMMIT:
      case SummitRoleEnum.ORGANIZER_SUMMIT:
      case SummitRoleEnum.SPEAKER_SUMMIT:
      case SummitRoleEnum.COACH_SUMMIT:
        return SummitRoleEnum.toString(role);
      case SwarmRoleEnum.ADVISOR_SWARM:
        return SwarmRoleEnum.toString(role);
      case KeynotePresentationRoleEnum.SPEAKER_KEYNOTE_PRESENTATION:
        return KeynotePresentationRoleEnum.toString(role);
      case WorkshopRoleEnum.SPEAKER_WS:
      case WorkshopRoleEnum.TRAINER_WS:
        return WorkshopRoleEnum.toString(role);
      case OtherRoleEnum.ADVISOR_OTHER:
      case OtherRoleEnum.COACH_OTHER:
      case OtherRoleEnum.CONSULTANT_OTHER:
      case OtherRoleEnum.DISRUPTOR_OTHER:
      case OtherRoleEnum.OTHER_OTHER:
      case OtherRoleEnum.SPEAKER_OTHER:
      case OtherRoleEnum.TRAINER_OTHER:
        return OtherRoleEnum.toString(role);
      case FastrackRoleEnum.CO_CURATOR_FT:
      case FastrackRoleEnum.CURATOR_FT:
      case FastrackRoleEnum.LOCAL_TEAM_MEMBER_FT:
      case FastrackRoleEnum.OBSERVER_EVALUATOR_FT:
      case FastrackRoleEnum.SOLUTION_ACCELERATOR_FT:
      case FastrackRoleEnum.TEAM_LEADER_FT:
      case FastrackRoleEnum.TEAM_MEMBER_FT:
        return FastrackRoleEnum.toString(role);
    }
  }
}

export {
  RoleEnum,
  WorkshopRoleEnum,
  KeynotePresentationRoleEnum,
  SwarmRoleEnum,
  SummitRoleEnum,
  OtherRoleEnum,
  FastrackRoleEnum,
  AdvisorCallRoleEnum,
  CertificationProgramRoleEnum,
  DisruptionSessionRoleEnum,
  SprintRoleEnum
};
