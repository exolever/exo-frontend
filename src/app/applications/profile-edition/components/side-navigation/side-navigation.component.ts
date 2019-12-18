import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ConsultantModel } from '@applications/shared/models';
import * as fromProfile from '@applications/profile/store/user-profile.reducer';

@Component({
  selector: 'app-profile-edition-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit, AfterViewInit {
  isConsultant$: Observable<boolean>;
  selected: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private chDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.isConsultant$ = this.store.pipe(
      select(state => fromProfile.getProfileUser(state)),
      map(profileUser => profileUser instanceof ConsultantModel)
    );
  }

  ngAfterViewInit() {
    this.getLastSegment();
    this.router.events.subscribe(() => {
      this.getLastSegment();
    });
    this.chDetectorRef.detectChanges();
  }

  navigateTo(data: MatSelectChange) {
    this.router.navigate([data.value], {relativeTo: this.route});
  }

  // Get last segment from the route (summary, about-you, etc..)
  getLastSegment() {
    this.selected = this.router['currentUrlTree'].root.children.primary
      .segments[this.router['currentUrlTree'].root.children.primary.segments.length - 1]
      .path;
  }

}
