import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { AppState } from '@core/store/reducers';
import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers';
import { OpportunityApplicantModel } from '@opportunities/models/opportunity-applicant.model';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import { BreakPointService } from '@applications/break-point/break-point.service';
import {
  ViewSowComponent
} from '@applications/ecosystem/modules/opportunities/shared/components/view-sow/view-sow.component';
import { SowService } from '@applications/ecosystem/modules/opportunities/shared/services/management-sow.service';
import { OpportunitiesManageActionsService } from '../../service/opportunies-manage-actions.service';
import {
  ApplicantDetailDialogComponent
} from '@opportunities/shared/components/applicant-detail-dialog/applicant-detail-dialog.component';

@Component({
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss']
})
export class ApplicantListComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  opportunity: OpportunityModel;
  selectedApplicants = [];
  conversations: Conversation[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private manageActionsService: OpportunitiesManageActionsService,
    private breakPointService: BreakPointService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private sowService: SowService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subscriptions.add(this.store.pipe(select(
        (state) => fromOpportunities.selectOpportunityAdmin(state.opportunities.opportunitiesAdmin, params.pk))
      ).subscribe((opportunity: OpportunityModel) => {
        this.opportunity = opportunity;
        this.getConversationsForApplicants();
      }));

      this.subscriptions.add(this.store.pipe(
        select((state) => fromOpportunities.selectAdminApplicantSelected(state.opportunities))
      ).subscribe(res => {
        this.selectedApplicants = res;
      }));
    });
  }

  getConversationsForApplicants() {
    this.subscriptions.add(this.store.pipe(select(state => selectorsCommunication.selectAllConversations(state)))
    .subscribe((conversations: Conversation[]) => {
      // Ñaas: We need to know the conversation related with every applicant. Backend "can't" send in the applicant
      // list, So i need iterate the conversations and the users to find the uuid applicant.
      if (this.opportunity) {
        this.opportunity.applicants.map((applicant: OpportunityApplicantModel) => {
          conversations.map((conversation: Conversation) => {
            conversation.users.map(user => {
              if (applicant.user.uuid === user.uuid) {
                applicant.conversation = conversation.id;
              }
            });
          });
        });
      }
    }));
  }

  viewSow(applicant: OpportunityApplicantModel) {
    this.sowService.getDataSow(applicant.pk).subscribe(data => {
      this.dialog.open(ViewSowComponent, {
        data: {sow: data}
      });
    });
  }

  viewApplicant(applicant: OpportunityApplicantModel): void {
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLg(ApplicantDetailDialogComponent, {
        data: {
          applicant,
          opportunity: this.opportunity
        },
        showChat: true,
        title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.TITLE'),
      }).subscribe()
    );
    this.subscriptions.add(
      this.breakPointService.fsSmDialogLgClosed().subscribe(goToConversation => {
        if (goToConversation) {
          this.onConversation(applicant);
        }
      })
    );
  }

  openSow (applicant: OpportunityApplicantModel, isEditing: boolean) {
    this.manageActionsService.openSow(applicant, this.opportunity, isEditing);
  }

  onReject (applicant: OpportunityApplicantModel) {
    this.manageActionsService.rejectApplicant(applicant, this.opportunity);
  }

  onConversation(applicant: OpportunityApplicantModel) {
    this.manageActionsService.goToConversation(applicant.conversation);
    this.router.navigate([`conversations`], { relativeTo: this.route.parent });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}
