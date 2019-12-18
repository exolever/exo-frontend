import { InjectionToken } from '@angular/core';
import { RoleCategoryEnum } from '@core/modules/roles/enums';

export interface BadgesConfig {
  categoryColor: {};
}

export const BadgeCategoryColor = {
  [RoleCategoryEnum.enums.SPRINT]: '#36c4ff',
  [RoleCategoryEnum.enums.WORKSHOP]: '#45ceb3',
  [RoleCategoryEnum.enums.FASTRACK]: '#fdaf62',
  [RoleCategoryEnum.enums.SWARM]: '#ff7172',
  [RoleCategoryEnum.enums.SUMMIT]: '#00a4ab',
  [RoleCategoryEnum.enums.COMMUNITY]: '#6128ff',
  [RoleCategoryEnum.enums.ADVISOR_CALL]: '#ffb1b1',
  [RoleCategoryEnum.enums.CERTIFICATION_PROGRAM]: '#001e47',
  [RoleCategoryEnum.enums.DISRUPTION_SESSION]: '#d29252',
  [RoleCategoryEnum.enums.OTHER]: '#79797c',
  [RoleCategoryEnum.enums.KEYNOTE_PRESENTATION]: '#b79dff',
};

export const badgesConfig: BadgesConfig = {
  categoryColor: BadgeCategoryColor
};

export let BADGES_CONFIG = new InjectionToken<BadgesConfig>(
  'badges.config');
