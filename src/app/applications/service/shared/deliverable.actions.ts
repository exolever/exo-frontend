import { Action } from '@ngrx/store';

import { PickerFileMetadata } from 'filestack-js/build/main/lib/picker';

import { Resource } from '@ecosystem-media-library/store/resource.model';

import { Step as StepModel } from '../old-project/models/step.model';
import { StepModel as GProjectStepModel } from '@applications/workspace/projects/models/step.model';

export enum TypeActionEnum {
  UPLOAD_DELIVERABLE =  '[Step - Assignment- Deliverable] Upload deliverable',
  UPLOAD_DELIVERABLE_SUCCESS =  '[Step - Assignment- Deliverable] Upload deliverable SUCCESS',
  UPLOAD_DELIVERABLE_FAIL =     '[Step - Assignment- Deliverable] Upload deliverable FAIL',
  DELETE_DELIVERABLE =   '[Step - Assignment- Deliverable] Delete deliverable',
  DELETE_DELIVERABLE_SUCCESS =   '[Step - Assignment- Deliverable] Delete deliverable SUCCESS',
  CHANGE_DELIVERABLE_PRIVACY =   '[Step - Assignment - Deliverable] Change visibility',
  CHANGE_DELIVERABLE_PRIVACY_SUCCESS =   '[Step - Assignment - Deliverable] Change visibility success',
}


export class UploadDeliverable implements Action {
  readonly type = TypeActionEnum.UPLOAD_DELIVERABLE;
  constructor(public payload: {
    stepSelected: StepModel | GProjectStepModel,
    file: PickerFileMetadata
  }) {}
}

export class UploadDeliverableSuccess implements Action {
  readonly type = TypeActionEnum.UPLOAD_DELIVERABLE_SUCCESS;
  constructor(public payload: Resource) {}
}

export class DeleteDeliverable implements Action {
  readonly type = TypeActionEnum.DELETE_DELIVERABLE;
  constructor(public payload: {
    stepSelected: StepModel | GProjectStepModel,
    file: Resource
  }) {}
}

export class DeleteDeliverableSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_DELIVERABLE_SUCCESS;
  constructor(public payload: Resource) {}
}

export class ChangeDeliverablePrivacy implements Action {
  readonly type = TypeActionEnum.CHANGE_DELIVERABLE_PRIVACY;
  constructor(public payload: {
    stepSelected: StepModel | GProjectStepModel,
    file: Resource
  }) {}
}

export class ChangeDeliverablePrivacySuccess implements Action {
  readonly type = TypeActionEnum.CHANGE_DELIVERABLE_PRIVACY_SUCCESS;
  constructor(public payload: any) {}
}

export type DeliverableActions =
  | UploadDeliverable
  | UploadDeliverableSuccess
  | DeleteDeliverable
  | DeleteDeliverableSuccess
  | ChangeDeliverablePrivacy
  | ChangeDeliverablePrivacySuccess;

