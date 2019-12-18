import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as QuestionsActions from '../action/questions.action';
import { Post } from '@forum/interfaces/post.interface';
import { QuestionSortEnum } from '@applications/swarm-sessions/services/swarm-sessions.service';

export interface QuestionsState extends EntityState<Post> {
  loading: boolean;
  loaded: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;
  pkQuestionSelected: number;
  searchBy: string;
  newNotification: boolean;
  session: number | undefined;
  sortBy: string;
}

const questionsAdapter: EntityAdapter<Post> = createEntityAdapter<Post>({
  selectId: (question: Post) => question.pk,
  sortComparer: false
});

const INITIAL_VALUES = {
  loading: false,
  loaded: false,
  pageIndex: undefined,
  count: undefined,
  pageSize: undefined,
  pkQuestionSelected: undefined,
  searchBy: '',
  newNotification: false,
  session: undefined,
  sortBy: QuestionSortEnum.NUM_COMMENTS_ASC,
};

const initialState: QuestionsState = questionsAdapter.getInitialState(INITIAL_VALUES);

export function reducer(state: QuestionsState = initialState, action: QuestionsActions.All): QuestionsState {
  switch (action.type) {
    case QuestionsActions.TypeActionEnum.LOAD_QUESTIONS:
      return questionsAdapter.removeAll({...state,
        loading: true,
        loaded: false,
        pkQuestionSelected: undefined,
        pageSize: action.payload.pageSize,
        pageIndex: action.payload.pageIndex,
        newNotification: false
      });

    case QuestionsActions.TypeActionEnum.SEARCH:
      return {...state, searchBy: action.payload.searchBy };

    case QuestionsActions.TypeActionEnum.LOAD_QUESTIONS_SUCCESS:
      return questionsAdapter.addAll(<Post[]>action.payload.results, {
        ... state,
        count: +action.payload.count,
        loading: false,
        loaded: true
      });

    case QuestionsActions.TypeActionEnum.LOAD_QUESTIONS_FAIL:
    case QuestionsActions.TypeActionEnum.CREATE_QUESTION_FAIL:
    case QuestionsActions.TypeActionEnum.EDIT_QUESTION_FAIL:
    case QuestionsActions.TypeActionEnum.DELETE_QUESTION_FAIL:
      return { ...state, loading: false };

    case QuestionsActions.TypeActionEnum.SELECT_QUESTION:
      return { ...state, pkQuestionSelected: action.payload.pkQuestion };

    case QuestionsActions.TypeActionEnum.CREATE_QUESTION:
    case QuestionsActions.TypeActionEnum.EDIT_QUESTION:
    case QuestionsActions.TypeActionEnum.DELETE_QUESTION:
    case QuestionsActions.TypeActionEnum.LOAD_QUESTION_DETAIL:
      return { ...state, loading: true };

    case QuestionsActions.TypeActionEnum.CREATE_QUESTION_SUCCESS:
      return questionsAdapter.upsertOne(new Post(action.payload), {
        ... state,
        count: state.count + 1,
        loading: false
      });

    case QuestionsActions.TypeActionEnum.EDIT_QUESTION_SUCCESS:
    case QuestionsActions.TypeActionEnum.LOAD_QUESTION_DETAIL_SUCCESS:
    case QuestionsActions.TypeActionEnum.SET_FAVORITE_SUCCESS:
    case QuestionsActions.TypeActionEnum.UNSET_FAVORITE_SUCCESS:
      return questionsAdapter.upsertOne(new Post(action.payload), {
        ... state,
        pkQuestionSelected: action.payload.pk,
        loading: false
      });

    case QuestionsActions.TypeActionEnum.DELETE_QUESTION_SUCCESS:
      return questionsAdapter.removeOne(action.payload, {
        ... state,
        count: state.count - 1,
        loading: false
      });

    case QuestionsActions.TypeActionEnum.RESTORE:
      return questionsAdapter.getInitialState({
        ...INITIAL_VALUES,
        searchBy: state.searchBy,
        pageSize: state.pageSize
      });

    case QuestionsActions.TypeActionEnum.SET_SESSION:
      return { ...state, session: action.payload };

    case QuestionsActions.TypeActionEnum.ENABLE_NOTIFICATON:
      const newNotification = action.payload.swarmTeamPk === state.session;
      return { ...state, newNotification: newNotification };

    case QuestionsActions.TypeActionEnum.SORT:
      return {...state,  sortBy: action.payload.sort };

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
} = questionsAdapter.getSelectors();
export const selectEmptyMoment = (state: QuestionsState) => !state.loading && state.count === 0 && state.loaded;
export const selectLoading = (state: QuestionsState) => state.loading;
export const selectLoaded = (state: QuestionsState) => state.loaded;
export const selectCount = (state: QuestionsState) => state.count;
export const selectPkSelected = (state: QuestionsState) => state.pkQuestionSelected;
export const selectSearchBy = (state: QuestionsState) => state.searchBy;
export const selectPageSize = (state: QuestionsState) => state.pageSize;
export const selectPageIndex = (state: QuestionsState) => state.pageIndex - 1;
export const selectNewNofitication = (state: QuestionsState) => state.newNotification;
export const selectSortBy = (state: QuestionsState) => state.sortBy;

