import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as QuestionsActions from '../action/questions.action';
import { Post } from '@forum/interfaces/post.interface';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
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
  connectedUsers: Array<string>;
  session: SwarmSession | undefined;
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
  connectedUsers: [],
  session: undefined,
  sortBy: QuestionSortEnum.NUM_COMMENTS_ASC
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
      return { ...state, loading: false };

    case QuestionsActions.TypeActionEnum.SELECT_QUESTION:
      return { ...state, pkQuestionSelected: action.payload.pkQuestion };

    case QuestionsActions.TypeActionEnum.LOAD_QUESTION_DETAIL:
      return { ...state, loading: true };

    case QuestionsActions.TypeActionEnum.LOAD_QUESTION_DETAIL_SUCCESS:
    case QuestionsActions.TypeActionEnum.SET_FAVORITE_SUCCESS:
    case QuestionsActions.TypeActionEnum.UNSET_FAVORITE_SUCCESS:
      return questionsAdapter.upsertOne(new Post(action.payload), {
        ... state,
        pkQuestionSelected: action.payload.pk,
        loading: false
      });

    case QuestionsActions.TypeActionEnum.RESTORE:
      return questionsAdapter.getInitialState({...INITIAL_VALUES, connectedUsers: state.connectedUsers});

    case QuestionsActions.TypeActionEnum.ENABLE_NOTIFICATON:
      let notification = false;
      if (state.session) {
        notification = action.payload.swarmPk === state.session.pk;
      }
      return { ...state, newNotification: notification };

    case QuestionsActions.TypeActionEnum.LOAD_SESSION_SUCCESS:
      return { ...state, session: action.payload };

    case QuestionsActions.TypeActionEnum.ADD_USERS_SUCCESS:
      return {... state, connectedUsers: [].concat(action.payload) };

    case QuestionsActions.TypeActionEnum.ADD_USER:
      state.connectedUsers.push(action.payload);
      return {... state, connectedUsers: [].concat(state.connectedUsers) };

    case QuestionsActions.TypeActionEnum.REMOVE_USER:
      const index = state.connectedUsers.indexOf(action.payload);
      state.connectedUsers.splice(index, 1);
      return {... state, connectedUsers: [].concat(state.connectedUsers) };

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
export const selectConnectedUsers = (state: QuestionsState) => state.connectedUsers;
export const selectSession = (state: QuestionsState) => state.session;
export const selectSortBy = (state: QuestionsState) => state.sortBy;
