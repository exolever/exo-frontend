import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as AnswersActions from '../action/answers.action';
import { Answer } from '@forum/interfaces/answer.interface';


export interface AnswersState extends EntityState<Answer> {
  loading: boolean;
  count: number | undefined;
  pkAnswerSelected: number;
  pageSize: number | undefined;
  pageIndex: number | undefined;
  newNotification: boolean;
  session: number | undefined;
}

const answersAdapter: EntityAdapter<Answer> = createEntityAdapter<Answer>({
  selectId: (answer: Answer) => answer.pk,
  sortComparer: (a: Answer, b: Answer) => a.modified.isSameOrBefore(b.modified) ? 1 : -1
});

const INITIAL_VALUES = {
  loading: false,
  count: undefined,
  pkAnswerSelected: undefined,
  pageSize: undefined,
  pageIndex: undefined,
  newNotification: false,
  session: undefined,
};

const initialState: AnswersState = answersAdapter.getInitialState(INITIAL_VALUES);


export function reducer(state: AnswersState = initialState, action: AnswersActions.All): AnswersState {
  switch (action.type) {
    case AnswersActions.TypeActionEnum.LOAD_ANSWERS:
      return answersAdapter.removeAll({...state,
        loading: true,
        pageSize: action.payload.pageSize,
        pageIndex: action.payload.pageIndex,
        newNotification: false
      });

    case AnswersActions.TypeActionEnum.LOAD_ANSWERS_SUCCESS:
      return answersAdapter.addAll(<Answer[]>action.payload.results, {
        ... state,
        count: +action.payload.count,
        loading: false
      });

    case AnswersActions.TypeActionEnum.CREATE_ANSWER:
    case AnswersActions.TypeActionEnum.DELETE_ANSWER:
      return { ...state, loading: true };

    case AnswersActions.TypeActionEnum.CREATE_ANSWER_SUCCESS:
      const newState = answersAdapter.addOne(action.payload, {
        ...state,
        count: state.count + 1,
        loading: false
      });

      return {...newState, ids: newState.ids.slice(0, newState.pageSize)};

    case AnswersActions.TypeActionEnum.DELETE_ANSWER_SUCCESS:
      return answersAdapter.removeOne(action.payload, {
        ...state,
        count: state.count - 1,
        loading: false
      });

    case AnswersActions.TypeActionEnum.RATE_ANSWER_SUCCESS:
    case AnswersActions.TypeActionEnum.UPDATE_ANSWER_SUCCESS:
    case AnswersActions.TypeActionEnum.SET_FAVORITE_SUCCESS:
    case AnswersActions.TypeActionEnum.UNSET_FAVORITE_SUCCESS:
      return answersAdapter.upsertOne(new Answer(action.payload), {
        ... state,
        pkAnswerSelected: action.payload.pk,
        loading: false
      });

    case AnswersActions.TypeActionEnum.LOAD_ANSWERS_FAIL:
    case AnswersActions.TypeActionEnum.CREATE_ANSWER_FAIL:
    case AnswersActions.TypeActionEnum.DELETE_ANSWER_FAIL:
      return { ...state, loading: false };

    case AnswersActions.TypeActionEnum.SET_SESSION:
      return { ...state, session: action.payload };

    case AnswersActions.TypeActionEnum.ENABLE_NOTIFICATON:
      const newNotification = action.payload.swarmTeamPk === state.session;
      return { ...state, newNotification: newNotification };

    case AnswersActions.TypeActionEnum.RESTORE:
        return answersAdapter.getInitialState({...INITIAL_VALUES, pageSize: state.pageSize});

    default:
      return state;
  }
}

// get the selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = answersAdapter.getSelectors();
export const selectEmptyMoment = (state: AnswersState) => !state.loading && state.count === 0;
export const selectLoading = (state: AnswersState) => state.loading;
export const selectCount = (state: AnswersState) => state.count;
export const selectPageSize = (state: AnswersState) => state.pageSize;
export const selectPageIndex = (state: AnswersState) => state.pageIndex - 1;
export const selectNewNofitication = (state: AnswersState) => state.newNotification;
