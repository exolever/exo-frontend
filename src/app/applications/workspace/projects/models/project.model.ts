import * as MomentTZ from 'moment-timezone';

import { UserModel } from '@app/core';

import { StepModel } from './step.model';
import { StatusProjectEnum, ProjectActionsEnum } from '../projects.enum';
import { StreamInterface } from './project.interface';
import { RolesInterface } from '@core/modules/roles/interfaces/roles.interface';


export class GenericProject {
  pk: number;
  uuid: string;
  name: string;
  location: string;
  placeId: string;
  start: MomentTZ.Moment;
  templateName: string;
  users: UserModel[];
  description: string;
  status: StatusProjectEnum;
  steps: StepModel[];
  currentStep?: {
    pk: number,
    name: string
  };
  client?: string;
  settings?: {
    ticketsModuleEnabled?: boolean;
    swarmSessionsModuleEnabled?: boolean;
    teamCommunicationsModuleEnabled?: boolean;
    askEcosystemEnabled?: boolean;
    directoryEnabled?: boolean;
    feedbackEnabled?: boolean;
    quizesEnabled?: boolean;
  };
  streams: Array<StreamInterface>;
  userActions: ProjectActionsEnum[] = [];
  projectRoles: Array<RolesInterface> = [];
  teamRoles: Array<RolesInterface> = [];

  constructor(obj?) {
    if (obj) {
      Object.assign(this, obj);
      this.client = obj.customer;
      if (obj.start) {
        this.start = MomentTZ(obj.start);
      }
      this.users = obj.users ? obj.users.map(u => new UserModel(u)) : [];
    }
  }

  isADraft(): boolean {
    return this.status === StatusProjectEnum.DRAFT;
  }

  isFinished(): boolean {
    return this.status === StatusProjectEnum.FINISHED;
  }

  isStarted(): boolean {
    return this.status === StatusProjectEnum.STARTED;
  }

  isWaiting(): boolean {
    return this.status === StatusProjectEnum.WAITING;
  }

  canEdit(): boolean {
    return this.userActions.includes(ProjectActionsEnum.EDIT);
  }

  canFinish(): boolean {
    return this.userActions.includes(ProjectActionsEnum.FINISH);
  }

  canPublish(): boolean {
    return this.userActions.includes(ProjectActionsEnum.PUBLISH);
  }

  canStart(): boolean {
    return this.userActions.includes(ProjectActionsEnum.START);
  }

  getTypeProject(): string {
    return this.templateName;
  }
}
