import { Action } from '@ngrx/store';
import { Quiz } from '@service/shared/models';
import { Feedback } from '@service/shared/models/feedback.model';
import { Task } from '@service/shared/modules/tasks/models';
import { StepModel } from '@applications/workspace/projects/models/step.model';

export enum TypeActionEnum {
  LOAD_GPROJECT_STEPS_SUCCESS =           '[GProjects - Steps] Load Success',
  SET_CURRENT_GPROJECT_STEP_BY_DEFAULT =  '[GProjects - Steps] Set current step from backend',
  LOAD_GPROJECT_STEP =                    '[GProjects - Step] Load',
  LOAD_GPROJECT_STEP_SUCCESS =            '[GProjects - Step] Load Success',
  LOAD_GPROJECT_STEP_FAIL =               '[GProjects - Step] Load Fail',
  MARK_ONE_GPROJECT_TASK_AS_DONE =        '[GProjects - Step - Assignment] Mark task as done',
  MARK_MANY_GPROJECT_TASKS_AS_DONE =      '[GProjects - Step - Assignment] Mark many tasks as done',
  MARK_GPROJECT_TASK_AS_DONE_SUCCESS =    '[GProjects - Step - Assignment] Mark task as done SUCCESS',
  MARK_GPROJECT_TASK_AS_TODO_ONE =        '[GProjects - Step - Assignment] Mark task as ToDo',
  MARK_GPROJECT_TASK_AS_TODO_MANY =       '[GProjects - Step - Assignment] Mark many tasks as ToDo',
  MARK_GPROJECT_TASK_AS_TODO_SUCCESS =    '[GProjects - Step - Assignment] Mark task as ToDo SUCCESS',
  FILL_GPROJECT_SURVEY =                  '[GProjects - Step - Assignment] Fill survey in typeform',
  FILL_GPROJECT_QUIZ =                    '[GProjects - Step - Assignment] Open Quiz in Typeform',
  UPDATE_GPROJECT_QUIZ =                  '[GProjects - Step - Assignment] Update Quiz with Typeform results',
  SEND_GPROJECT_FEEDBACK =                '[GProjects - Step - Assignment] Send feedback',
  SEND_GPROJECT_FEEDBACK_SUCCESS =        '[GProjects - Step - Assignment] Send feedback success',
}


export class LoadGProjectStepsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_GPROJECT_STEPS_SUCCESS;
  constructor(public payload: StepModel[]) { }
}

export class SetCurrentGProjectStep implements Action {
  readonly type = TypeActionEnum.SET_CURRENT_GPROJECT_STEP_BY_DEFAULT;
  constructor(public payload: number) { }
}

export class LoadGProjectStep implements Action {
  readonly type = TypeActionEnum.LOAD_GPROJECT_STEP;
  constructor(public payload: { pkService: number, pkTeam: number, pkStep: number }) { }
}

export class LoadGProjectStepSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_GPROJECT_STEP_SUCCESS;
  constructor(public payload: StepModel) { }
}

export class LoadGProjectStepFail implements Action {
  readonly type = TypeActionEnum.LOAD_GPROJECT_STEP_FAIL;
  constructor(public payload: any) { }
}

export class MarkOneGProjectTaskAsDone implements Action {
  readonly type = TypeActionEnum.MARK_ONE_GPROJECT_TASK_AS_DONE;
  constructor(public payload: { projectPk: number, teamPk: number, stepPk: number, task: Task }) { }
}

export class MarkManyGProjectTaskAsDone implements Action {
  readonly type = TypeActionEnum.MARK_MANY_GPROJECT_TASKS_AS_DONE;
  constructor(public payload: { projectPk: number, teamPk: number, stepPk: number, tasks: Task[] }) { }
}

export class MarkGProjectTaskAsDoneSuccess implements Action {
  readonly type = TypeActionEnum.MARK_GPROJECT_TASK_AS_DONE_SUCCESS;
  constructor(public payload: { projectPk: number, teamPk: number, stepPk: number, tasks: Task[] }) { }
}

export class MarkOneGProjectTaskAsToDo implements Action {
  readonly type = TypeActionEnum.MARK_GPROJECT_TASK_AS_TODO_ONE;
  constructor(public payload: { projectPk: number, teamPk: number, stepPk: number, task: Task }) { }
}

export class MarkManyGProjectTaskAsToDo implements Action {
  readonly type = TypeActionEnum.MARK_GPROJECT_TASK_AS_TODO_MANY;
  constructor(public payload: { projectPk: number, teamPk: number, stepPk: number, tasks: Task[] }) { }
}

export class MarkGProjectTaskAsToDoSuccess implements Action {
  readonly type = TypeActionEnum.MARK_GPROJECT_TASK_AS_TODO_SUCCESS;
  constructor(public payload: { projectPk: number, teamPk: number, stepPk: number, tasks: Task[] }) { }
}

export class FillGProjectSurvey implements Action {
  readonly type = TypeActionEnum.FILL_GPROJECT_SURVEY;
  constructor(public payload: string) { }
}

export class FillGProjectQuiz implements Action {
  readonly type = TypeActionEnum.FILL_GPROJECT_QUIZ;
  constructor(public payload: StepModel) { }
}

export class UpdateGProjectQuizRatings implements Action {
  readonly type = TypeActionEnum.UPDATE_GPROJECT_QUIZ;
  constructor(public payload: { quiz: Quiz, stepPk: number }) { }
}

export class SendGProjectFeedback implements Action {
  readonly type = TypeActionEnum.SEND_GPROJECT_FEEDBACK;
  constructor(public payload: Feedback) { }
}

export class SendGProjectFeedbackSuccess implements Action {
  readonly type = TypeActionEnum.SEND_GPROJECT_FEEDBACK_SUCCESS;
  constructor(public payload: Feedback) { }
}


export type StepActions =
  | LoadGProjectStepsSuccess
  | SetCurrentGProjectStep
  | LoadGProjectStep
  | LoadGProjectStepSuccess
  | LoadGProjectStepFail
  | MarkOneGProjectTaskAsDone
  | MarkManyGProjectTaskAsDone
  | MarkGProjectTaskAsDoneSuccess
  | MarkOneGProjectTaskAsToDo
  | MarkManyGProjectTaskAsToDo
  | MarkGProjectTaskAsToDoSuccess
  | FillGProjectSurvey
  | FillGProjectQuiz
  | UpdateGProjectQuizRatings
  | SendGProjectFeedback
  | SendGProjectFeedbackSuccess
;

