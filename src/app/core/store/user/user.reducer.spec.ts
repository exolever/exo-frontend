// TODO: Refactor with user reducer.
// import * as fromUser from '@core/store/user/user.reducer';
// import * as userActions from '@core/store/user/user.action';
//
// import { FakeUserModelFactory } from '@core/faker_factories';
//
// describe('User Reducer', () => {
//   const initialState: fromUser.UserState = {
//     user: undefined
//   };
//
//   it('should return the default state', () => {
//     const action = {} as any;
//     const state = fromUser.reducer(undefined, action);
//     expect(state).toEqual(initialState);
//   });
//
//   it('should return the initialState', () => {
//     const action = new userActions.GetUser();
//     const state = fromUser.reducer(initialState, action);
//
//     expect(state.user).toEqual(initialState.user)
//   });
//
//   it('should populate the user', () => {
//     const user = new FakeUserModelFactory();
//     const action = new userActions.GetUserSuccess(user);
//     const state = fromUser.reducer(initialState, action);
//
//     expect(state.user).toEqual(user);
//   });
//
//   it('should update the user', () => {
//     const user = new FakeUserModelFactory();
//     user.email = 'TestUpdateUser@gmail.com';
//
//     const action = new userActions.UpdateUser(user);
//     const state = fromUser.reducer(initialState, action);
//
//     expect(state.user).toEqual(user);
//   });
//
//   it('should return state with the default action', () => {
//     const state = fromUser.reducer(initialState, <any>'DefaultAction');
//
//     expect(state).toEqual(initialState);
//     expect(state.user).toEqual(undefined);
//   })
// });
