enum RoleCategoryEnum {
  ADVISOR_CALL = <any>'AC',
  CERTIFICATION_PROGRAM = <any>'CP',
  DISRUPTION_SESSION = <any>'DS',
  SPRINT = <any>'SP',
  FASTRACK = <any>'FA',
  OTHER = <any>'OT',
  SUMMIT = <any>'SU',
  SWARM = <any>'SW',
  KEYNOTE_PRESENTATION = <any>'TA',
  WORKSHOP = <any>'WO',
}

enum RoleCommunityEnum {
  COMMUNITY = <any>'CC',
}

export enum CategoryHelpCenter {
  ADVISOR_CALL = 'http://help.openexo.com/en/articles/3468069-roles-in-advisory-calls',
  FASTRACK = 'http://help.openexo.com/en/articles/3468051-roles-in-a-fastrack',
  WORKSHOP = 'http://help.openexo.com/en/articles/3468064-roles-in-a-workshop',
  DISRUPTION_SESSION = 'http://help.openexo.com/en/articles/3468070-roles-in-disruption-sessions',
  CERTIFICATION_PROGRAM = 'http://help.openexo.com/en/articles/3468088-roles-in-certifications-programs',
  SUMMIT = 'http://help.openexo.com/en/articles/3468076-roles-in-an-exo-summit',
  SWARM = 'http://help.openexo.com/en/articles/3468066-roles-in-a-swarm',
  SPRINT = 'https://help.openexo.com/en/articles/3455275-roles-in-an-exo-sprint',
  KEYNOTE_PRESENTATION = 'http://help.openexo.com/en/articles/3468072-roles-in-keynote-presentations',
  OTHER = 'http://help.openexo.com/en/articles/3468096-roles-for-generic-projects',
}

namespace RoleCategoryEnum {
  export const enums = {
    ...RoleCategoryEnum,
    ...RoleCommunityEnum,
  };
  export function toString(cat: RoleCategoryEnum | RoleCommunityEnum): string {
    switch (cat) {
      case RoleCategoryEnum.ADVISOR_CALL:
        return 'Advisory Call';
      case RoleCategoryEnum.CERTIFICATION_PROGRAM:
        return 'Certification Programs';
      case RoleCategoryEnum.DISRUPTION_SESSION:
        return 'Disruption Session';
      case RoleCategoryEnum.SPRINT:
        return 'ExO Sprint';
      case RoleCategoryEnum.FASTRACK:
        return 'Fastrack';
      case RoleCategoryEnum.OTHER:
        return 'Other';
      case RoleCategoryEnum.SUMMIT:
        return 'Summit';
      case RoleCategoryEnum.KEYNOTE_PRESENTATION:
        return 'Keynote presentation';
      case RoleCategoryEnum.SWARM:
        return 'Swarm';
      case RoleCategoryEnum.WORKSHOP:
        return 'Workshop';
      case RoleCommunityEnum.COMMUNITY:
        return 'Community';
    }
  }
}

export { RoleCategoryEnum };
