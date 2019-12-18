import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';
import * as fromProfileActions from '@applications/profile/store/user-profile.actions';

import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '@applications/profile/profile-view.config';

import { Urls, UrlService } from '@app/core';
import {
  ShareProfileDialogComponent
} from '@profile-edition/dialogs/share-profile-dialog/share-profile-dialog.component';
import { Location } from '@angular/common';
import { environment } from '@environments/environment';
import { domainPublicProfile } from '@profile-edition/services/profile-edition.service';

@Component({
  selector: 'app-profile-edition-container',
  templateUrl: './profile-edition-container.component.html',
  styleUrls: ['./profile-edition-container.component.scss']
})
export class ProfileEditionContainerComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private urlService: UrlService,
    public location: Location,
    @Inject(PROFILE_VIEW_CONFIG) public config: ProfileViewConfig
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(state => fromProfile.getLoadingState(state)));
    /** load user initially in case the application user refreshes the page */
    this.subscriptions.push(
      this.store.pipe(select(state => fromProfile.getCurrentSlug(state)))
        .subscribe((slug: string) => {
          if ( this.route.snapshot.params['slug'] !== slug ) {
            this.store.dispatch(new fromProfileActions.LoadUser(this.route.snapshot.params['slug']));
            this.store.dispatch(new fromProfileActions.SetCurrentSlug(this.route.snapshot.params['slug']));
          }
        })
    );
  }

  share() {
    const publicProfile = this.buildUrlPublicProfile();
    this.dialog.open(
      ShareProfileDialogComponent,
      {
        width: '777px',
        data: {url: publicProfile}
      }
    );
  }

  preview() {
    const publicProfile = this.buildUrlPublicProfile();
    window.open(publicProfile);
  }

  buildUrlPublicProfile() {
    let urlProfile =
      `${location.origin}/${this.urlService.getPath([Urls.PROFILE_PUBLIC, this.route.snapshot.params.slug])}`;

    // The public profile URL is in other domain with an iframe to the old public/profile/slug.. So we need overwrite.
    if (environment.production) {
      urlProfile = `${domainPublicProfile}${this.route.snapshot.params.slug}/`;
    }

    return urlProfile;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
