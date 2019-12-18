import { FakeUserModelFactory } from '@core/faker_factories';

import * as userActions from '@core/store/user/user.action';
import { HttpErrorResponse } from '@angular/common/http';

const userModel = new FakeUserModelFactory();

describe('User Actions', () => {

  describe('Load user', () => {
    it('should create an action', () => {
      const action = new userActions.GetUser();

      expect({ ...action }).toEqual({
        type: userActions.GET_USER
      });
    });
  });

  describe('Load user success', () => {
    it('should create an action', () => {
      const action = new userActions.GetUserSuccess(userModel);

      expect({ ...action }).toEqual({
        type: userActions.GET_USER_SUCCESS,
        payload: userModel
      });
    });
  });

  describe('Load user fail', () => {
    it('should create an action', () => {
      const errorResponse = new HttpErrorResponse({});
      const action = new userActions.GetUserFail(errorResponse);
      expect({ ...action }).toEqual({
        type: userActions.GET_USER_FAIL,
        payload: errorResponse
      });
    });
  });

  describe('Update user', () => {
    it('should create an action', () => {
      const action = new userActions.UpdateUser(userModel);

      expect({ ...action }).toEqual({
        type: userActions.UPDATE_USER,
        payload: userModel
      });
    });
  });

});
