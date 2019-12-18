import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { StaticPermissions } from '@core/services/acl/permissions';
import { UserService } from '@core/services';
import { UserModel } from '@core/models/user/user.model';
import { AppState } from '@core/store/reducers';
import { OverlayMediaService } from '@ecosystem-media-library/components/overlay-media/services/overlay-media.service';
import { Resource } from '@ecosystem-media-library/store/resource.model';
import * as CrudActions from '@ecosystem-media-library/store/crud/crud.actions';

import { ResourceFormComponent } from '../resource-form/resource-form.component';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss']
})
export class ResourceCardComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {
  protected dialogRef: MatDialogRef<ResourceFormComponent>;
  private user: UserModel;
  private subscription: Subscription;
  @Input() resource: Resource;

  constructor(
    private userService: UserService,
    protected dialog: MatDialog,
    private store: Store<AppState>,
    private overlayMediaService: OverlayMediaService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.userService.user$.subscribe(user => this.user = user);
  }

  onShow() {
    this.overlayMediaService.open({
      video: this.resource
    });
  }

  onEdit() {
    this.dialogRef = this.dialog.open(ResourceFormComponent, { data: this.resource });
  }

  onDelete() {
    this.store.dispatch(new CrudActions.Delete(this.resource));
  }

  canEditVideo(): boolean {
    return this.user.hasPermissions(StaticPermissions.MEDIA_LIBRARY_UPDATE);
  }

  canDeleteVideo(): boolean {
    return this.user.hasPermissions(StaticPermissions.MEDIA_LIBRARY_DELETE);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
