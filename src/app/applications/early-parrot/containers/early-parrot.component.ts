import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '@applications/early-parrot/model/campaign.model';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-early-parrot',
  templateUrl: './early-parrot.component.html',
  styleUrls: ['./early-parrot.component.scss'],
})
export class EarlyParrotComponent implements OnInit {

  campaigns: Campaign[];
  selectedCampaign: string;
  addIframeFirstTime = true;
  scriptEpVars: any;
  scriptSharePage: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.campaigns = data.campaign;
      if (this.campaigns.length > 0) {
        // Order campaigns alphabetically.
        this.campaigns.sort((a, b) => (a.name > b.name) ? 1 : -1);
        this.setCookieEarlyParrotToken(this.campaigns[0].token);
        // Select the first one and load the iframe.
        this.selectedCampaign = this.campaigns[0].campaignId;
        this.buildScriptElements(this.campaigns[0]);
      }
    });
  }

  setCookieEarlyParrotToken(token: string) {
    if (token) {
      this.document.cookie = `confirmToken=${token}`;
    }
  }

  buildScriptElements(campaign: Campaign) {

    // Prevent remove HTMLElement the first time.
    if (!this.addIframeFirstTime) {
      this.scriptEpVars.parentNode.removeChild(this.scriptEpVars);
      this.scriptSharePage.parentNode.removeChild(this.scriptSharePage);
    }

    this.scriptEpVars = document.createElement('script');
    this.scriptEpVars.type = 'text/javascript';
    this.scriptEpVars.textContent = 'var epVars = {\n' +
      ' adminUrl : "https://admin.earlyparrot.com",\n' +
      ' appUrl : "https://app.earlyparrot.com",\n' +
      ' campaignId : "' + campaign.campaignId + '"\n' +
      '}';
    document.getElementsByTagName('head')[0].appendChild(this.scriptEpVars);

    this.scriptSharePage = document.createElement('script');
    this.scriptSharePage.type = 'text/javascript';
    this.scriptSharePage.async = true;
    this.scriptSharePage.src = 'https://s3.amazonaws.com/earlyparrot-production-scripts/ep-share-page.js';
    document.getElementsByTagName('head')[0].appendChild(this.scriptSharePage);

    this.addIframeFirstTime = false;
  }

  campaignIsSelected(campaign: Campaign) {
    return this.selectedCampaign === campaign.campaignId;
  }

  iframeEarlyParrot(campaign: Campaign) {
    if (this.selectedCampaign === campaign.campaignId) {
      return false;
    }

    this.selectedCampaign = campaign.campaignId;
    this.setCookieEarlyParrotToken(campaign.token);
    this.buildScriptElements(campaign);
  }

}
