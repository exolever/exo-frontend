import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Urls } from '@core/services';
import { AgreementModel } from '@core/models/user/agreement.model';
import * as userActions from '@core/store/user/user.action';
import { UserModel } from '@core/models/user/user.model';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { StaticPermissions } from '@core/services/acl/permissions';
import { sectionsEnums } from '@core/enums';

import { MarketPlaceService } from './marketplace-contitions.service';


@Component({
  templateUrl: './marketplace-conditions.component.html',
  styleUrls: ['./marketplace-conditions.component.scss']
})
export class MarketplaceConditionsComponent implements OnInit, OnDestroy {
  agreement: AgreementModel;
  acceptControl = new FormControl(false, Validators.required);
  user: UserModel;
  subscription = new Subscription();
  nextUrl: string;
  constructor(
    private store: Store<AppState>,
    private marketPlaceService: MarketPlaceService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.nextUrl = history.state && history.state.nextUrl ? history.state.nextUrl : Urls.ECOSYSTEM_OPPORTUNITIES;
    this.subscription.add(
      this.store.pipe(
        select((state) => fromUser.getUser(state)),
        take(1), // Avoid call twice, after launching UpdateDataUser action to mark as visited the section
        tap(user => {if (!user) { this.store.dispatch(new userActions.GetUser()); } }),
        filter(user => user !== undefined)
      ).subscribe((user: UserModel) => {
        this.user = user;
        this.store.dispatch(new userActions.UpdateDataUser({
          sectionsVisited: [...this.user.sectionsVisited, sectionsEnums.Opportunities]
        }));
        if (this.user && user.hasPermissionsSuperuserIncluded(StaticPermissions.CAN_ACCESS_MARKETPLACE)) {
          this.router.navigate([this.nextUrl]);
        } else {
          this.getMarketplaceConditions();
        }

      })
    );
  }

  getMarketplaceConditions() {
    this.subscription.add(this.marketPlaceService.getMarketPlaceConditions().subscribe(
      resp => this.agreement = resp
    ));
  }

  acceptConditions() {
    this.subscription.add(this.marketPlaceService.acceptAgreement(this.agreement.pk).subscribe(
      () => {
        this.store.dispatch(new userActions.UpdateDataUser({
          userPermissions: [...this.user.userPermissions, StaticPermissions.CAN_ACCESS_MARKETPLACE]
        }));
        this.router.navigate([this.nextUrl]);
        this.snackBar.open(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.MARKETPLACE_CONDITIONS.SIGNED'),
          this.translate.instant('COMMON.CLOSE'),
          { panelClass: 'success' }
        );
      }
    ));
  }

  seeMarketplaceConditions() {
    window.open(this.agreement.pdf, '_blank');
  }

  goToHelpCenter() {
    window.open('https://help.openexo.com/', '_blank');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
