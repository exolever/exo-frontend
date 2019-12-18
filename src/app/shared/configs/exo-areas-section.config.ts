import { ExoAreasEnum } from '../../applications/shared/enums/exo-areas.enum';

interface AreasConfigurationInterface {
  name: string;
  code: ExoAreasEnum;
  icon: string;
  description: string;
  descriptionProfile?: string;
}
export const exoAreasSectionConfiguration: AreasConfigurationInterface[] = [
  {
    name: 'PROFILE.EXO_AREAS.ORGANIZATIONS',
    code: ExoAreasEnum.ORGANIZATIONS,
    icon: 'group_work',
    description: 'PROFILE.EXO_AREAS.ORGANIZATIONS_DESCRIPTION',
    descriptionProfile: 'PROFILE.EXO_AREAS.ORGANIZATIONS_PROFILE'
  },
  {
    name: 'PROFILE.EXO_AREAS.INSTITUTIONS',
    code: ExoAreasEnum.INSTITUTIONS,
    icon: 'account_balance',
    description: 'PROFILE.EXO_AREAS.INSTITUTIONS_DESCRIPTION',
    descriptionProfile: 'PROFILE.EXO_AREAS.INSTITUTIONS_PROFILE'
  },
  {
    name: 'PROFILE.EXO_AREAS.PEOPLE',
    code: ExoAreasEnum.PEOPLE,
    icon: 'person',
    description: 'PROFILE.EXO_AREAS.PEOPLE_DESCRIPTION',
    descriptionProfile: 'PROFILE.EXO_AREAS.PEOPLE_PROFILE'
  }

];
