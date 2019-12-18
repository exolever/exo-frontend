import { Injectable, Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { OpportunityApplicantModel } from '@ecosystem/modules/opportunities/models/opportunity-applicant.model';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import { OverlayService } from '@overlay/services/overlay.service';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';

import * as opportunitiesAdminActions from '../store/actions/opportunities-admin.action';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { SowContainerComponent } from '../components/sow/sow-container/sow-container.component';

@Injectable()
export class OpportunitiesManageActionsService {

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private store: Store<AppState>,
    private overlayService: OverlayService
  ) { }

  openSow(applicant: OpportunityApplicantModel, opportunity: OpportunityModel, isEditing: boolean) {
    this.overlayService.open(
      <Component>SowContainerComponent,
      {
        data: {
          applicant: applicant,
          opportunity: opportunity,
          isEditing: isEditing
        },
      }
    );
  }

  rejectApplicant(applicant: OpportunityApplicantModel, opportunity: OpportunityModel ) {
    const keyMessage =  applicant.isSelected() ?
      'ECOSYSTEM.OPPORTUNITIES.CONFIRMATION_DIALOG.REJECTED.WARNING_BOX' :
      'ECOSYSTEM.OPPORTUNITIES.CONFIRMATION_DIALOG.REJECTED.INFORMATION_BOX';
    this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      data: {
        title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CONFIRMATION_DIALOG.REJECTED.TITLE'),
        typeAlert: applicant.isSelected() ? 'warning' : 'info',
        message: this.translate.instant(keyMessage),
        applicant: applicant,
        action: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.REJECT')
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        const message = typeof res === 'string' ? res : undefined;
        this.store.dispatch(new opportunitiesAdminActions.OpportunityRejectAplicant(
          {applicant: applicant, message: message}
        ));
      }
    });
  }

  goToConversation(idConversation: number) {
    this.store.dispatch(new actionCommunication.ConversationNavigate(idConversation));
  }

}
