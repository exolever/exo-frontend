enum CertificationEnum {
  FOUNDATION = 'CFO',
  CONSULTANT = 'CCO',
  SPRINT_COACH = 'CSC',
  AMBASSADOR = 'CEA',
  TRAINER = 'CTR',
  BOARD_ADVISOR = 'CBA'
}

namespace CertificationEnum {
  export function toString(role: CertificationEnum): string {
    switch (role) {
      case CertificationEnum.FOUNDATION:
        return 'Advisor';
      case CertificationEnum.CONSULTANT:
        return 'Coach';
      case CertificationEnum.SPRINT_COACH:
        return 'Consultant';
      case CertificationEnum.AMBASSADOR:
        return 'Disruptor';
      case CertificationEnum.TRAINER:
        return 'Other';
      case CertificationEnum.BOARD_ADVISOR:
        return 'Speaker';
    }
  }
}

export { CertificationEnum };
