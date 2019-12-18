import { Action } from '@ngrx/store';
import { Quiz } from '@applications/service/shared/models';
import { Feedback } from '@applications/service/shared/models/feedback.model';
import { Task } from '@applications/service/shared/modules/tasks/models';

import { Step } from '../../models/step.model';

export const LOAD_STEPS = '[Steps] Load';
export const LOAD_STEPS_SUCCESS = '[Steps] Load Success';
export const LOAD_STEPS_FAIL = '[Steps] Load Fail';
export const SET_CURRENT_STEP_BY_DEFAULT = '[Steps] Set current step from backend';

export const LOAD_STEP = '[Step] Load';
export const LOAD_STEP_SUCCESS = '[Step] Load Success';
export const LOAD_STEP_FAIL = '[Step] Load Fail';

export const MARK_AS_DONE_ONE = '[Step - Assignment] Mark task as done';
export const MARK_AS_DONE_MANY = '[Step - Assignment] Mark many tasks as done';
export const MARK_AS_DONE_SUCCESS = '[Step - Assignment] Mark task as done SUCCESS';

export const MARK_AS_TODO_ONE = '[Step - Assignment] Mark task as ToDo';
export const MARK_AS_TODO_MANY = '[Step - Assignment] Mark many tasks as ToDo';
export const MARK_AS_TODO_SUCCESS = '[Step - Assignment] Mark task as ToDo SUCCESS';

export const DOWNLOAD_REPORT = '[Step] Download Report';
export const DOWNLOAD_REPORT_SUCCESS = '[Step] Download SUCCESS';
export const DOWNLOAD_REPORT_FAIL = '[Step] Download FAIL';

export const FILL_SURVEY = '[Step - Assignment] Fill survey in typeform';
export const FILL_QUIZ = '[Step - Assignment] Open Quiz in Typeform';
export const UPDATE_QUIZ = '[Step - Assignment] Update Quiz with Typeform results';
export const SEND_FEEDBACK = '[Step - Assignment] Send feedback';
export const SEND_FEEDBACK_SUCCESS = '[Step - Assignment] Send feedback success';


export class LoadSteps implements Action {
  readonly type = LOAD_STEPS;

  constructor(public payload: { pkService: string, pkTeam: string }) {
  }
}

export class LoadStepsSuccess implements Action {
  readonly type = LOAD_STEPS_SUCCESS;

  constructor(public payload: Step[]) {
  }
}

export class LoadStepsFail implements Action {
  readonly type = LOAD_STEPS_FAIL;

  constructor(public payload: any) {
  }
}

export class SetCurrentStep implements Action {
  readonly type = SET_CURRENT_STEP_BY_DEFAULT;

  constructor(public payload: string) {
  }
}

export class LoadStep implements Action {
  readonly type = LOAD_STEP;

  constructor(public payload: { pkService: string, pkTeam: string, pkStep: string }) {
  }
}

export class LoadStepSuccess implements Action {
  readonly type = LOAD_STEP_SUCCESS;

  constructor(public payload: Step) {
  }
}

export class LoadStepFail implements Action {
  readonly type = LOAD_STEP_FAIL;

  constructor(public payload: any) {
  }
}

export class MarkOneTaskAsDone implements Action {
  readonly type = MARK_AS_DONE_ONE;

  constructor(public payload: { projectPk: string, teamPk: string, stepPk: string, task: Task }) {
  }
}

export class MarkManyTaskAsDone implements Action {
  readonly type = MARK_AS_DONE_MANY;

  constructor(public payload: { projectPk: string, teamPk: string, stepPk: string, tasks: Task[] }) {
  }
}

export class MarkTaskAsDoneSuccess implements Action {
  readonly type = MARK_AS_DONE_SUCCESS;

  constructor(public payload: { projectPk: string, teamPk: string, stepPk: string, tasks: Task[] }) {
  }
}

export class MarkOneTaskAsToDo implements Action {
  readonly type = MARK_AS_TODO_ONE;

  constructor(public payload: { projectPk: string, teamPk: string, stepPk: string, task: Task }) {
  }
}

export class MarkManyTaskAsToDo implements Action {
  readonly type = MARK_AS_TODO_MANY;

  constructor(public payload: { projectPk: string, teamPk: string, stepPk: string, tasks: Task[] }) {
  }
}

export class MarkTaskAsToDoSuccess implements Action {
  readonly type = MARK_AS_TODO_SUCCESS;

  constructor(public payload: { projectPk: string, teamPk: string, stepPk: string, tasks: Task[] }) {
  }
}

export class FillSurvey implements Action {
  readonly type = FILL_SURVEY;

  constructor(public payload: string) {
  }
}

export class FillQuiz implements Action {
  readonly type = FILL_QUIZ;

  constructor(public payload: Step) {
  }
}

export class UpdateQuizRatings implements Action {
  readonly type = UPDATE_QUIZ;

  constructor(public payload: { quiz: Quiz, stepPk: number }) {
  }
}

export class SendFeedback implements Action {
  readonly type = SEND_FEEDBACK;

  constructor(public payload: Feedback) {
  }
}

export class SendFeedbackSuccess implements Action {
  readonly type = SEND_FEEDBACK_SUCCESS;

  constructor(public payload: Feedback) {
  }
}

export type StepActions =
  | LoadSteps
  | LoadStepsSuccess
  | LoadStepsFail
  | LoadStep
  | SetCurrentStep
  | LoadStepSuccess
  | LoadStepFail
  | MarkOneTaskAsDone
  | MarkManyTaskAsDone
  | MarkTaskAsDoneSuccess
  | MarkOneTaskAsToDo
  | MarkManyTaskAsToDo
  | MarkTaskAsToDoSuccess
  | FillQuiz
  | UpdateQuizRatings
  | SendFeedback
  | SendFeedbackSuccess
;

