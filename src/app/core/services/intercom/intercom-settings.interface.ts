import { IProjectsInfo } from '@core/interfaces/projects-info.interface';
import { segmentUserEnum } from '@core/enums';

export interface IntercomSettings {
  app_id: string;
  email: string;
  name: string;
  user_id: string;
  user_hash: string;
  horizontal_padding?: number;
  vertical_padding?: number;
  'company': string;
  'groups': Array<number>;
  'is_active': boolean;
  'is_superuser': boolean;
  'isStaff': boolean;
  'language': string;
  'phone': number;
  'pkConsultant': string;
  'projects': IProjectsInfo;
  'segment': segmentUserEnum;
  'short_me': string;
  'status': string;
  'location': string;
  'timezone': string;
  'activities': string;
  'certificates': string;
}
