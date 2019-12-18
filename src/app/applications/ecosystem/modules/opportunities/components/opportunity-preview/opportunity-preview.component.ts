import { Component, Inject } from '@angular/core';
import { DATA } from '@overlay/services/overlay.service';
import { OverlayReference } from '@overlay/overlay-ref';

import { Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as opportunitiesActions from '../../store/actions/opportunities.action';
import { OpportunityModel } from '../../models/opportunity.model';

@Component({
  templateUrl: './opportunity-preview.component.html'
})
export class OpportunityPreviewComponent {
  url: string;

  constructor(
    private overlayRef: OverlayReference,
    private store: Store<AppState>,
    @Inject(DATA) public data: {
      title: string,
      opportunity: OpportunityModel, // response preview
      originalData: {
        data: OpportunityModel,
        baseUrls: {list: string, viewDetails: string}
      }
    }
  ) { }

  closeOverlay() {
    this.overlayRef.close();
  }

  confirm () {
    this.store.dispatch(new opportunitiesActions.CreateOpportunity(this.data.originalData));
    this.closeOverlay();
  }

}
