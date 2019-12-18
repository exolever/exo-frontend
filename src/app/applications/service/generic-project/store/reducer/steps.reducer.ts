import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as MomentTZ from 'moment-timezone';

import { Task, TaskStatus } from '@applications/service/shared/modules/tasks/models';
import { AppState } from '@core/store/reducers';
import {
  InformationBlock,
  InformationBlockType
} from '@service/shared/modules/information-block/models/information-block.model';
import { StepModel } from '@applications/workspace/projects/models/step.model';

import * as DeliverableActions from '../../../shared/deliverable.actions';
import * as StepActions from '../actions/steps.actions';


export interface StepsState extends EntityState<StepModel> {
  selectedStepPk: number | undefined;
  currentStepPk: number | undefined;
  uploadingDeliverable: boolean;
  loaded: boolean;
  loading: boolean;
}

export const stepAdapter: EntityAdapter<StepModel> =
  createEntityAdapter<StepModel>({
    selectId: (step: StepModel) => step.pk,
    sortComparer: (a: StepModel, b: StepModel) => a.index > b.index ? 1 : -1
  });

export const initialState: StepsState = stepAdapter.getInitialState({
  selectedStepPk: undefined,
  currentStepPk: undefined,
  uploadingDeliverable: false,
  loaded: false,
  loading: false
});

const setTaskStatus = (
  state: StepsState,
  action: StepActions.MarkGProjectTaskAsToDoSuccess | StepActions.MarkGProjectTaskAsDoneSuccess,
  status: TaskStatus
) => {
  const tasks = action.payload.tasks.map(t => t.pk);

  getSelectedStep(state).assignments[0].blocks.
    find(b => b.type === InformationBlockType.Task).contents.
    filter((task: Task) => tasks.includes(task.pk)).
    forEach((task: Task) => task.status = status);
};


export function reducer(
  state: StepsState = initialState,
  action: StepActions.StepActions | DeliverableActions.DeliverableActions
): StepsState {
  switch (action.type) {
    case StepActions.TypeActionEnum.LOAD_GPROJECT_STEP_FAIL: {
      return {...state};
    }

    case StepActions.TypeActionEnum.SET_CURRENT_GPROJECT_STEP_BY_DEFAULT: {
      return {
        ...state,
        selectedStepPk: action.payload
      };
    }

    case StepActions.TypeActionEnum.LOAD_GPROJECT_STEPS_SUCCESS: {
      if (action.payload.length > 0) {
        let currentStepPk = action.payload[0].pk;
        let selectedStep = action.payload[0].pk;
        action.payload.forEach((item: StepModel) => {
          if (item.start.isBefore(MomentTZ())) {
            selectedStep = item.pk;
          }
          if (item.current) {
            currentStepPk = item.pk;
          }
        });
        return stepAdapter.addAll(action.payload, {
          ...state,
          currentStepPk: currentStepPk,
          selectedStepPk: selectedStep,
          loaded: true
        });
      }
      return stepAdapter.addAll(action.payload, {
        ...state,
        loaded: true
      });
    }

    case StepActions.TypeActionEnum.LOAD_GPROJECT_STEP_SUCCESS: {
      const oldstate = {
        ...state,
        selectedStepPk: action.payload.pk,
        loading: false
      };

      const newstate = stepAdapter.upsertOne(action.payload, oldstate);
      newstate.entities[action.payload.pk] = action.payload;
      return newstate;
    }

    case StepActions.TypeActionEnum.LOAD_GPROJECT_STEP: {
      return {
        ...state,
        loading: true
      };
    }

    case StepActions.TypeActionEnum.MARK_GPROJECT_TASK_AS_DONE_SUCCESS:
      setTaskStatus(state, action, TaskStatus.Done);

      return {
        ...state
      };

    case StepActions.TypeActionEnum.MARK_GPROJECT_TASK_AS_TODO_SUCCESS:
      setTaskStatus(state, action, TaskStatus.ToDo);

      return {
        ...state
      };

    case StepActions.TypeActionEnum.UPDATE_GPROJECT_QUIZ:
      if (getSelectedStep(state).pk === action.payload.stepPk) {
        getSelectedStep(state).personalQuiz = action.payload.quiz;
      }

      return {
        ...state
      };

    case StepActions.TypeActionEnum.SEND_GPROJECT_FEEDBACK_SUCCESS:
      getSelectedStep(state).feedback = action.payload;
      return {
        ...state
      };

    case DeliverableActions.TypeActionEnum.UPLOAD_DELIVERABLE:
      return {
        ...state,
        uploadingDeliverable: true
      };

    case DeliverableActions.TypeActionEnum.UPLOAD_DELIVERABLE_SUCCESS:
      getSelectedStep(state).assignments[0].deliverables.unshift(action.payload);

      return {
        ...state,
        uploadingDeliverable: false
      };

    case DeliverableActions.TypeActionEnum.DELETE_DELIVERABLE_SUCCESS:
      const step = getSelectedStep(state);
      step.assignments[0].deliverables = step.assignments[0].deliverables.filter(file => file.pk !== action.payload.pk);

      return stepAdapter.upsertOne(step, state);

    case DeliverableActions.TypeActionEnum.CHANGE_DELIVERABLE_PRIVACY_SUCCESS:
      getSelectedStep(state).assignments[0].deliverables
        .find(r => r.pk === action.payload.pk)
        .visibility = action.payload.result.visibility;
      return {
        ...state
      };

    default:
      return state;
  }
}
export const {
  selectEntities,
  selectAll,
} = stepAdapter.getSelectors();

export const getSelectedPk = (state: StepsState) => state.selectedStepPk;
export const getCurrentPk = (state: StepsState) => state.currentStepPk;
export const isUploadingDeliverable = (state: StepsState) => state.uploadingDeliverable;
export const getLoaded = (state: StepsState) => state.loaded;
export const getLoading = (state: StepsState) => state.loading;

export const getSelectedStep = (state: StepsState) =>
  state.selectedStepPk ? state.entities[state.selectedStepPk] : null;

export const hasAllTaskDone = (state: StepsState, infoBlock: InformationBlock) => {
  let blockInformation = null;
  let emptyBlock = false;

  if (getSelectedStep(state) && getSelectedStep(state).assignments[0]) {
    blockInformation = getSelectedStep(state).assignments[0].blocks.filter((block) => block.pk === infoBlock.pk);
    emptyBlock = !blockInformation.length;
  }

  return blockInformation && !emptyBlock ?
    blockInformation[0].contents.filter((task: Task) => task.isToDo()).length === 0 : null;
};

export const selectWeeklyFeedback = (state: AppState) => {
  const step = getSelectedStep(state.genericProject.stepsGenericProject);
  return step ? step.feedback : undefined;
};

export const selectReceivedFeedback = (state: AppState) => {
  const step = getSelectedStep(state.genericProject.stepsGenericProject);
  return step ? step.feedbackReceived : undefined;
};

export const selectTask = (state: AppState, pkStep: number, pkTask: number) => {
  const step = getSelectedStep(state.genericProject.stepsGenericProject);
  const blocks = step ?
    step.assignments[0].blocks.filter((block) => block.type === InformationBlockType.Task) :
    undefined;

  return blocks ? <Task>blocks.map(block => block.contents.find(task => +task['pk'] === pkTask)).pop() : undefined;
};



