import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { PromptDataInterface} from '@shared/modules/prompt-dialog/prompt-dialog.interface';
import {
  CloseDialogComponent
} from '@opportunities/shared/components/close/close-dialog.component';
import { BreakPointService } from '@applications/break-point/break-point.service';
import {
  ReopenDialogComponent
} from '@applications/ecosystem/modules/opportunities/modules/admin/components/reopen-dialog/reopen-dialog.component';

import { OpportunityModel } from '../../models/opportunity.model';

@Injectable({
  providedIn: 'root'
})
export class ManagementOpportunitiesActionsService {

  constructor(
    private translate: TranslateService,
    private promptDialogService: PromptDialogService,
    private breakPointService: BreakPointService,
    private dialog: MatDialog
  ) { }

  onDelete(): Observable<any> {
    const config: PromptDataInterface = {
      title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.DELETE_DIALOG.TITLE'),
      messages: [
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.DELETE_DIALOG.MESSAGE_1'),
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.DELETE_DIALOG.MESSAGE_2')
      ],
      primaryButton: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.ACTIONS.DELETE'),
      secondaryButton: this.translate.instant('COMMON.CANCEL'),
      textArea: {
        placeholder: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.DELETE_DIALOG.PLACEHOLDER'),
        isRequired: false
      }
    };
    return this.promptDialogService.open(config).pipe(
      filter(res => res !== false && res !== undefined),
      map(res => res === true ? '' : res)
    );
  }

  onClose(opportunity: OpportunityModel): Observable<any> {
    const title = this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANTS.CLOSE');
    return this.breakPointService.fsSmDialogLg(CloseDialogComponent, {
      opportunity,
      title,
    });
  }

  onReopen(opportunity: OpportunityModel): void {
    this.dialog.open(ReopenDialogComponent, {data: { opportunity }});
  }

}
