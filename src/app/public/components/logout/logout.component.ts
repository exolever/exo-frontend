import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/store/reducers';
import * as userActions from '@core/store/user/user.action';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';

import { Store } from '@ngrx/store';


@Component({
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(new actionCommunication.ConversationsDisconnectSocket());
    this.store.dispatch(new userActions.LogoutUser());
  }
}

