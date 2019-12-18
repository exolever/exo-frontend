import { createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums';

import * as fromActions from './certifications.action';

export interface CertificationsState extends EntityState<CertificationModel> { }

const sortByLevel = (c1: CertificationModel, c2: CertificationModel) => {
  return c1.level > c2.level ? 1 : -1;
};

export const certirficationAdapter: EntityAdapter<CertificationModel> =
  createEntityAdapter<CertificationModel>({
    selectId: (certification: CertificationModel) => certification.code,
    sortComparer: sortByLevel
  });

export const initialState: CertificationsState = certirficationAdapter.getInitialState({});

export function reducer(
  state: CertificationsState = initialState,
  action: fromActions.CertificationsActions
): CertificationsState {

  switch (action.type) {

    case fromActions.GET_CERTIFICATIONS: {
      return {
        ...state
      };
    }

    case fromActions.GET_CERTIFICATIONS_SUCCESS: {
      return certirficationAdapter.addAll(action.payload, state);
    }

    case fromActions.GET_CERTIFICATIONS_FAIL: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal

} = certirficationAdapter.getSelectors();

const getEntitiesArray = (entities) => {
  return Object.keys(entities).map(i => entities[i]);
};

export function getCertificationJourney(state: CertificationsState): CertificationModel[] {
  const entities = getEntitiesArray(state.entities);
  return entities
    ? entities.filter((certification: CertificationModel) => (
        [CertificationEnum.FOUNDATION, CertificationEnum.CONSULTANT, CertificationEnum.SPRINT_COACH]
      ).includes(certification.code))
    : [];
}

export function getOpportunityCertifications(state: CertificationsState): CertificationModel[] {
  const entities = getEntitiesArray(state.entities);
  return entities
    ? entities.filter((certification: CertificationModel) => (
        [CertificationEnum.FOUNDATION, CertificationEnum.CONSULTANT, CertificationEnum.SPRINT_COACH,
          CertificationEnum.TRAINER]
      ).includes(certification.code))
    : [];
}

export const getCertification = createSelector(
  selectEntities,
  (entities, props) => entities ? entities[props.code] : undefined
);
