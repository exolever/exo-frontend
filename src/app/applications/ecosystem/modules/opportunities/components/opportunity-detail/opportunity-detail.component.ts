import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '@core/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import * as fromUser from '@core/store/user/user.reducer';
import { UserModel } from '@core/models';

import * as opportunitiesActions from '../../store/actions/opportunities.action';
import * as fromOpportunities from '../../store/reducers';
import { OpportunityDialogApplyComponent } from '../opportunity-dialog-apply/opportunity-dialog-apply.component';
import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunityActionEnum, OpportunityStatusEnum } from '../../models/opportunity.enum';
import { ViewSowComponent } from '../../shared/components/view-sow/view-sow.component';
import { SowService } from '../../shared/services/management-sow.service';
import {
  RequiredCertificationDialogComponent
} from '@shared/components/dialogs/required-certification-dialog/required-certification-dialog.component';
import { EventParams } from '@core/enums/analytics.enum';

@Component({
  templateUrl: './opportunity-detail.component.html',
  styleUrls: ['./opportunity-detail.component.scss']
})
export class OpportunityDetailComponent implements OnInit, OnDestroy {
  opportunity$: Observable<OpportunityModel>;
  tabs: any[];
  statusEnum = OpportunityStatusEnum;
  private subscriptions = new Subscription();
  loading$: Observable<boolean>;
  user$: Observable<UserModel>;

  constructor(
    private breadcrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private matSnackBar: MatSnackBar,
    private translate: TranslateService,
    private sowService: SowService
  ) { }

  ngOnInit() {
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.subscriptions.add(this.route.params.pipe(
      tap((params) => this.store.dispatch(new opportunitiesActions.LoadOpportunity(params.pk))),
      tap((params) =>
        this.opportunity$ = this.store.pipe(
          select((state) => fromOpportunities.selectOpportunity(state.opportunities.opportunities, params.pk)),
          filter(opportunity => !!opportunity),
          tap((opportunity) => {
            this.buildTabs(opportunity);
            this.breadcrumbService.updateBreadCrumb({label: opportunity.title});
          })
        )
      )
    ).subscribe());

    this.loading$ = this.store.pipe(
      select((state) => fromOpportunities.selectIsLoading(state.opportunities))
    );
  }

  private buildTabs(opportunity: OpportunityModel): void {
    this.tabs = [
      {
        label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.CHAT'),
        link: 'chat'
      }
    ];
    if (opportunity.hasApplicationFeedback()) {
      this.tabs.push({
        label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.FEEDBACK'),
        link: 'feedback'
      });
    }
  }

  hasSow(opportunity: OpportunityModel): boolean {
    return opportunity && opportunity.myApplicant && opportunity.myApplicant.isSelected();
  }

  viewSow(opportunity: OpportunityModel) {
    this.sowService.getDataSow(opportunity.myApplicant.pk).subscribe(data => {
      this.dialog.open(ViewSowComponent, {
        data: {sow: data}
      });
    });
  }

  doAction(user: UserModel, opportunity: OpportunityModel, action: OpportunityActionEnum) {
    action === OpportunityActionEnum.O
      && (!opportunity.certificationRequired || user.hasMinimunCertification(opportunity.certificationRequired))
      ? this.openDialogToApply(opportunity)
      : this.showModal(opportunity);
  }

  private showModal(opportunity: OpportunityModel) {
    this.dialog.open(RequiredCertificationDialogComponent, {
      data: {
        certification: opportunity.certificationRequired,
        prefix: 'ECOSYSTEM.OPPORTUNITIES.NEED_CERTIFICATE',
        source: EventParams.MARKETPLACE
      }
    });
  }

  openDialogToApply(opportunity: OpportunityModel): void {
    const dialogRef = this.dialog.open(OpportunityDialogApplyComponent, {
      autoFocus: false,
      data: {
        opportunity: opportunity,
        name: opportunity.subject
      }
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.matSnackBar.open(
            this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLY_DIALOG.SNACKBAR.SUCCESS'),
            this.translate.instant('NOTIFICATION.CLOSE')
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
