import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { StaticPermissions } from '@core/services/acl/permissions';
import { UserModel } from '@core/models/user/user.model';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';

import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { LIBRARY_CONFIG } from '../../ecosystem-media-library.conf';

@Component({
  selector: 'app-layout-media',
  templateUrl: './layout-media.component.html',
  styleUrls: ['./layout-media.component.scss']
})
export class LayoutMediaComponent implements OnInit, OnDestroy {
  protected dialogRef: MatDialogRef<ResourceFormComponent>;
  private user: UserModel;
  private subscription: Subscription;

  constructor(
    private store: Store<AppState>,
    protected dialog: MatDialog,
    @Inject( LIBRARY_CONFIG ) public config
  ) {}

  ngOnInit() {
    this.subscription =
      this.store.pipe(select((state) => fromUser.getUser(state))).subscribe(user => this.user = user);
  }

  addVideo() {
    this.dialogRef = this.dialog.open(ResourceFormComponent);
  }

  canAddVideo(): boolean {
    return this.user.hasPermissions(StaticPermissions.MEDIA_LIBRARY_UPLOAD);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
