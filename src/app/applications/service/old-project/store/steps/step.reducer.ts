import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as MomentTZ from 'moment-timezone';

import {Task, TaskStatus} from '@applications/service/shared/modules/tasks/models';
import {AppState} from '@core/store/reducers';

import * as deliverableActions from '../../../shared/deliverable.actions';
import { Step } from '../../models/step.model';
import * as stepActions from './step.actions';

import {
  InformationBlock,
  InformationBlockType
} from '@applications/service/shared/modules/information-block/models/information-block.model';

export interface StepsState extends EntityState<Step> {
  selectedStepPk: string | undefined;
  currentStepPk: string | undefined;
  uploadingDeliverable: boolean;
  loaded: boolean;
  loading: boolean;
}

export const stepAdapter: EntityAdapter<Step> =
  createEntityAdapter<Step>({
    selectId: (step: Step) => step.pk,
    sortComparer: (a: Step, b: Step) => a.index > b.index ? 1 : -1
  });

export const initialState: StepsState = stepAdapter.getInitialState({
  selectedStepPk: undefined,
  currentStepPk: undefined,
  uploadingDeliverable: false,
  loaded: false,
  loading: false
});

export const isUploadingDeliverable = (state: StepsState) => {
  return state.uploadingDeliverable;
};

export const getSelectedPk = (state: StepsState) => {
  return state.selectedStepPk;
};

export const getCurrentPk = (state: StepsState) => {
  return state.currentStepPk;
};

export const getSelectedStep = (state: StepsState) => {
  return state.selectedStepPk ? state.entities[state.selectedStepPk] : null;
};

export const getStepsLoaded = (state: StepsState) => {
  return state.loaded;
};

export const isLoading = (state: StepsState) => {
  return state.loading;
};

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

const setTaskStatus = (state: StepsState, action: stepActions.StepActions, status: TaskStatus) => {
  const tasks = action.payload.tasks.map(t => t.pk);

  getSelectedStep(state).assignments[0].blocks.
  find(b => b.type === InformationBlockType.Task).contents.
  filter((task: Task) => tasks.includes(task.pk)).
  forEach((task: Task) => task.status = status);
};

export const selectWeeklyFeedback = (state: AppState) => {
  const step = getSelectedStep(state.service.steps);
  return step ? step.feedback : undefined;
};

export const selectReceivedFeedback = (state: AppState) => {
  const step = getSelectedStep(state.service.steps);
  return step ? step.feedbackReceived : undefined;
};

export const selectTask = (state: AppState, pkStep: string, pkTask: string) => {
  const step = getSelectedStep(state.service.steps);
  const blocks = step ?
    step.assignments[0].blocks.filter((block) => block.type === InformationBlockType.Task) :
    undefined;

  return blocks ? <Task>blocks.map(block => block.contents.find(task => task['pk'] === pkTask)).pop() : undefined;
};

export function reducer(
  state: StepsState = initialState,
  action: stepActions.StepActions | deliverableActions.DeliverableActions
): StepsState {
  switch (action.type) {

    case stepActions.LOAD_STEPS: {
      return {
        ...state
      };
    }

    case stepActions.SET_CURRENT_STEP_BY_DEFAULT: {
      return {
        ...state,
        selectedStepPk: action.payload
      };
    }

    case stepActions.LOAD_STEPS_SUCCESS: {
      if (action.payload.length > 0) {
        let currentStepPk = action.payload[0].pk;
        let selectedStep = action.payload[0].pk;
        action.payload.forEach((item: Step) => {
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

    case stepActions.LOAD_STEPS_FAIL: {
      return {
        ...state
      };
    }

    case stepActions.LOAD_STEP_SUCCESS: {
      const oldstate = {
        ...state,
        selectedStepPk: action.payload.pk,
        loading: false
      };

      const newstate = stepAdapter.upsertOne(action.payload, oldstate);
      newstate.entities[action.payload.pk] = action.payload;
      return newstate;
    }

    case stepActions.LOAD_STEP_FAIL: {
      return {
        ...state
      };
    }

    case stepActions.LOAD_STEP: {
      return {
        ...state,
        loading: true
      };
    }

    case stepActions.MARK_AS_DONE_SUCCESS:
      setTaskStatus(state, action, TaskStatus.Done);

      return {
        ...state,
        entities: state.entities
      };

    case stepActions.MARK_AS_TODO_SUCCESS:
      setTaskStatus(state, action, TaskStatus.ToDo);

      return {
        ...state,
        entities: state.entities
      };

    case stepActions.UPDATE_QUIZ:
      if (getSelectedStep(state).pk === action.payload.stepPk.toString()) {
        getSelectedStep(state).personalQuiz = action.payload.quiz;
      }

      return {
        ...state
      };

    case stepActions.SEND_FEEDBACK_SUCCESS:
      getSelectedStep(state).feedback = action.payload;
      return {
        ...state
      };

    case deliverableActions.TypeActionEnum.UPLOAD_DELIVERABLE:
      return {
        ...state,
        uploadingDeliverable: true
      };

    case deliverableActions.TypeActionEnum.UPLOAD_DELIVERABLE_SUCCESS:
      getSelectedStep(state).assignments[0].deliverables.unshift(action.payload);

      return {
        ...state,
        uploadingDeliverable: false
      };

    case deliverableActions.TypeActionEnum.DELETE_DELIVERABLE_SUCCESS:
      const step = getSelectedStep(state);
      step.assignments[0].deliverables = step.assignments[0].deliverables.filter(file => file.pk !== action.payload.pk);

      return  stepAdapter.upsertOne(step, state);

    case deliverableActions.TypeActionEnum.CHANGE_DELIVERABLE_PRIVACY_SUCCESS:
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
