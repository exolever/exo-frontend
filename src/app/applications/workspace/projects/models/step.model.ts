import * as MomentTZ from 'moment-timezone';

import { Quiz } from '@applications/service/shared/models/quiz.model';
import { Assignment } from '@applications/service/shared/models/assignment.model';
import { Feedback } from '@service/shared/models/feedback.model';
import { ReceivedFeedback } from '@service/shared/models/received-feedback.model';

export class StepModel {
  pk: number;
  name: string;
  assignments: Assignment[];
  enabledLearn: boolean;
  enabledDeliver: boolean;
  enabledReflect: boolean;
  deliverableStepEndpoint?: string;
  personalQuiz?: Quiz;
  index?: number;
  link?: string;
  current?: boolean;
  start?: MomentTZ.Moment;
  end?: MomentTZ.Moment;
  feedback?: Feedback;
  feedbackReceived?: ReceivedFeedback[];
  stepConf?: any;

  // TODO: hablar con tomás para ver si los incluye
  canDownload?: boolean;

  constructor(obj?) {
    if (obj) {
      Object.assign(this, obj);
      this.start = MomentTZ(obj.start);
      this.end = MomentTZ(obj.end);
      if (this.assignments) {
        this.assignments = obj.assignments.map(a => new Assignment(a));
      }
      this.personalQuiz = new Quiz(obj.personalQuiz);
      const stepConf = this.stepConf || undefined;
      this.enabledLearn = stepConf && stepConf.hasOwnProperty('enabledLearn') ? stepConf.enabledLearn : true;
      this.enabledDeliver = stepConf && stepConf.hasOwnProperty('enabledDeliver') ? stepConf.enabledDeliver : true;
      this.enabledReflect = stepConf && stepConf.hasOwnProperty('enabledReflect') ? stepConf.enabledReflect : false;
    }
  }
}
