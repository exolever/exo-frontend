import {
  Component, OnInit, Input, OnChanges, ChangeDetectionStrategy, Output, EventEmitter
} from '@angular/core';

import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';

import { ManagementActionsEnum } from '../../opportunities-shared.enum';

@Component({
  selector: 'app-opportunity-menu-actions',
  templateUrl: './opportunity-menu-actions.component.html',
  styleUrls: ['./opportunity-menu-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityMenuActionsComponent extends ManageMatMenuComponent implements OnInit, OnChanges {
  @Input() opportunity: OpportunityModel;
  @Output() sendAction: EventEmitter<ManagementActionsEnum> = new EventEmitter();

  actionsToShow: Array<{ action: ManagementActionsEnum, translationKey: string }> = [];
  constructor() {
    super();
   }

  ngOnInit() {
    this.setUpOptions();
  }

  ngOnChanges() {
    this.setUpOptions();
  }

  setUpOptions(): void {
    this.actionsToShow = [];
    if (this.opportunity.canEdit()) {
      this.actionsToShow.push({ action: ManagementActionsEnum.Edit, translationKey: 'EDIT' });
    }
    if (this.opportunity.canRemove()) {
      this.actionsToShow.push({ action: ManagementActionsEnum.Delete, translationKey: 'DELETE' });
    }
    if (this.opportunity.canClose()) {
      this.actionsToShow.push({ action: ManagementActionsEnum.Close, translationKey: 'CLOSE' });
    }
    if (this.opportunity.canReopen()) {
      this.actionsToShow.push({ action: ManagementActionsEnum.Reopen, translationKey: 'REOPEN' });
    }
  }

  onAction(action: ManagementActionsEnum): void {
    this.sendAction.emit(action);
  }

  hasOptions(): boolean {
    return this.actionsToShow.length > 0;
  }
}
