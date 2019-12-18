import * as MomentTZ from 'moment-timezone';

import { Assignment } from '../../shared/models/assignment.model';
import { Quiz } from '../../shared/models/quiz.model';
import { Feedback } from '../../shared/models/feedback.model';
import { ReceivedFeedback } from '../../shared/models/received-feedback.model';
import { TeamInterface } from './team.inteface';

export interface IStep {
  pk: string;
  name: string;
  guidelines?: string;
  description?: string;
  index?: number;
  link?: string;
  start?: MomentTZ.Moment;
  end?: MomentTZ.Moment;
  assignments: Array<Assignment>;
  personalQuiz?: Quiz;
  deliverableStepEndpoint?: string;
  feedback?: Feedback;
  current?: boolean;
  hasAssignments?: boolean;
}

export class Step implements IStep {
  pk: string;
  name: string;
  description?: string;
  index?: number;
  link?: string;
  start?: MomentTZ.Moment;
  end?: MomentTZ.Moment;
  assignments: Array<Assignment>;
  personalQuiz?: Quiz;
  deliverableStepEndpoint: string;
  feedback?: Feedback;
  enabledLearn: boolean;
  enabledDeliver: boolean;
  enabledReflect: boolean;
  current?: boolean;
  hasAssignments?: boolean;
  team?: TeamInterface;
  feedbackReceived?: ReceivedFeedback[];
  canDownload?: boolean;

  constructor(data: IStep) {
    Object.assign(this, data);
    this.pk = this.pk ? this.pk.toString() : undefined;
    this.start = MomentTZ(data.start);
    this.end = MomentTZ(data.end);
    if (this.assignments) {
      this.assignments = data.assignments.map(a => new Assignment(a));
    }

    if (!data.hasOwnProperty('hasAssignments') && data.assignments) {
      this.hasAssignments = data.assignments.length > 0;
    }

    this.personalQuiz = new Quiz(data.personalQuiz);
    const tabsConf = data.hasOwnProperty('stepConf') ? data['stepConf'] : undefined;

    this.enabledLearn = tabsConf && tabsConf.hasOwnProperty('enabledLearn') ? tabsConf.enabledLearn : true;
    this.enabledDeliver = tabsConf && tabsConf.hasOwnProperty('enabledDeliver') ? tabsConf.enabledDeliver : true;
    this.enabledReflect = tabsConf && tabsConf.hasOwnProperty('enabledReflect') ? tabsConf.enabledReflect : false;
  }
}
